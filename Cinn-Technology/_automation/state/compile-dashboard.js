#!/usr/bin/env node
/**
 * compile-dashboard.js — regenerates the LEADS array in coffee leads/Dashboard.html
 * from the pipeline CSV + the compiled Cinn-Coffee-Leads.md.
 *
 * Run:  node _automation/state/compile-dashboard.js
 *
 * No dependencies. Reads two files, parses, injects, writes. <1 second.
 * If the HTML or markdown don't exist, it errors loudly and does nothing.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CSV_PATH = path.join(ROOT, '_automation', 'state', 'lead-pipeline.csv');
const MD_PATH = path.join(ROOT, 'coffee leads', 'Cinn-Coffee-Leads.md');
const HTML_PATH = path.join(ROOT, 'coffee leads', 'Dashboard.html');

// ===== RFC4180 CSV parser (handles quoted fields, commas inside quotes, escaped "") =====
function parseCsv(text) {
    const rows = [];
    let row = [], field = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQ) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else { inQ = false; }
            } else { field += c; }
        } else {
            if (c === '"') { inQ = true; }
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else if (c === '\r') { /* skip */ }
            else { field += c; }
        }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
}

// ===== Parse DM scripts out of the markdown (per cafe, between First DM / Soft pitch / Re-engagement) =====
function parseScripts(md) {
    const scripts = {};
    // Split into per-cafe sections by H2 headers (## N. CafeName — Score)
    const sections = md.split(/^## /m);
    for (const section of sections) {
        // First line is like "1. Kiss the Hippo — Score 9/10" or "1. Brown & Green Cafe ⭐ Score 10/10 — TOP PRIORITY"
        const nameMatch = section.match(/^(?:\d+\.\s+)?(.+?)(?:\s+[⭐🔥]| —|\n)/);
        if (!nameMatch) continue;
        const name = nameMatch[1].trim();
        const firstM = section.match(/\*\*First DM[^:]*:\*\*\s*\n>\s*(.+?)(?=\n\s*\n|\n\*\*|\n##)/s);
        const softM = section.match(/\*\*Soft pitch[^:]*:\*\*\s*\n>\s*(.+?)(?=\n\s*\n|\n\*\*|\n##)/s);
        const reM = section.match(/\*\*Re-engagement[^:]*:\*\*\s*\n>\s*(.+?)(?=\n\s*\n|\n\*\*|\n##)/s);
        if (firstM || softM || reM) {
            scripts[name.toLowerCase()] = {
                first: (firstM ? firstM[1].trim() : '').replace(/\s+/g, ' '),
                soft: (softM ? softM[1].trim() : '').replace(/\s+/g, ' '),
                reengage: (reM ? reM[1].trim() : '').replace(/\s+/g, ' ')
            };
        }
    }
    return scripts;
}

// ===== Find scripts for a cafe by fuzzy name match =====
// Normalises accents + punctuation so "Pique Cafe" (CSV) matches "Pique Café" (markdown)
function normalise(s) {
    return s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9 &]/g, '')                      // keep alphanumerics, space, ampersand
        .replace(/\s+/g, ' ').trim();
}
function findScripts(scriptsDb, cafeName, strategy, status) {
    if (status !== 'trigger-drafted') return null;
    const key = normalise(cafeName);
    // Try exact normalised match first
    for (const k of Object.keys(scriptsDb)) {
        if (normalise(k) === key) return scriptsDb[k];
    }
    // Then fuzzy contains
    for (const k of Object.keys(scriptsDb)) {
        const nk = normalise(k);
        if (nk.includes(key) || key.includes(nk)) return scriptsDb[k];
    }
    return null;
}

// ===== Short trigger line for the card (1-line summary) =====
function shortTrigger(lead) {
    if (lead.trigger_strategy === 'chain_nearby') {
        if (lead.hook.includes("Gail's")) return "Gail's Bakery opening on Westow Hill";
        if (lead.hook.includes('Blank Street')) return 'Blank Street opened nearby';
        return 'Chain opening nearby';
    }
    if (lead.trigger_strategy === 'slow_season') return 'August slow season';
    if (lead.trigger_strategy === 'new_opening') return 'Opened in last ~12 months';
    if (lead.trigger_strategy === 'menu_launch') return 'New menu item launched';
    if (lead.trigger_strategy === 'press_feature') return 'Recently featured in press';
    return lead.trigger_strategy;
}

// ===== Build a JS object literal for one lead =====
function leadToJs(lead, scripts) {
    const parts = [];
    parts.push(`name:${JSON.stringify(lead.cafe_name)}`);
    parts.push(`address:${JSON.stringify(lead.address)}`);
    parts.push(`website:${JSON.stringify(lead.website)}`);
    parts.push(`instagram:${JSON.stringify(lead.instagram)}`);
    parts.push(`email:${JSON.stringify(lead.email)}`);
    parts.push(`score:${parseInt(lead.fit_score) || 0}`);
    parts.push(`tier:${parseInt(lead.recommended_tier) || 1}`);
    parts.push(`hook:${JSON.stringify(lead.hook)}`);
    parts.push(`status:${JSON.stringify(lead.status)}`);
    parts.push(`strategy:${JSON.stringify(lead.trigger_strategy)}`);
    parts.push(`trigger:${JSON.stringify(shortTrigger(lead))}`);
    parts.push(`scripts:${scripts ? JSON.stringify(scripts) : 'null'}`);
    return `{${parts.join(',')}}`;
}

// ===== Main =====
function main() {
    for (const p of [CSV_PATH, MD_PATH, HTML_PATH]) {
        if (!fs.existsSync(p)) {
            console.error('✗ Missing: ' + p);
            process.exit(1);
        }
    }

    const csvText = fs.readFileSync(CSV_PATH, 'utf8').trimEnd();
    const mdText = fs.readFileSync(MD_PATH, 'utf8');
    let html = fs.readFileSync(HTML_PATH, 'utf8');

    const rows = parseCsv(csvText);
    const header = rows[0];
    const colIdx = name => header.indexOf(name);
    const leads = rows.slice(1)
        .filter(r => r.length === header.length && r[colIdx('cafe_name')])
        .map(r => Object.fromEntries(header.map((k, i) => [k, r[i] || ''])))
        // Dashboard focus: chain_nearby leads only (other strategies paused)
        .filter(l => l.trigger_strategy === 'chain_nearby');

    const scriptsDb = parseScripts(mdText);

    // Sort: drafted first, then by score desc within each
    leads.sort((a, b) => {
        const ad = a.status === 'trigger-drafted' ? 0 : 1;
        const bd = b.status === 'trigger-drafted' ? 0 : 1;
        if (ad !== bd) return ad - bd;
        return (parseInt(b.fit_score) || 0) - (parseInt(a.fit_score) || 0);
    });

    const leadsJs = leads.map(l => leadToJs(l, findScripts(scriptsDb, l.cafe_name, l.trigger_strategy, l.status))).join(',\n            ');

    // Replace LAST_UPDATED and LEADS array in the HTML
    const today = new Date().toISOString().slice(0, 10);
    html = html.replace(/const LAST_UPDATED = "[^"]*";/, `const LAST_UPDATED = "${today}";`);
    // Replace the LEADS array — match from `const LEADS = [` to the closing `];` before the next const
    const leadsRegex = /const LEADS = \[[\s\S]*?\n        \];/;
    if (!leadsRegex.test(html)) {
        console.error('✗ Could not find LEADS array in Dashboard.html — aborting to avoid corruption.');
        process.exit(1);
    }
    html = html.replace(leadsRegex, `const LEADS = [\n            ${leadsJs}\n        ];`);

    fs.writeFileSync(HTML_PATH, html, 'utf8');
    console.log(`✓ Dashboard recompiled — ${leads.length} leads, ${Object.keys(scriptsDb).length} cafes with scripts parsed.`);
    console.log('  Written to: ' + HTML_PATH);
}

main();
