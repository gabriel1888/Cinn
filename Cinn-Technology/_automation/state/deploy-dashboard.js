#!/usr/bin/env node
/**
 * deploy-dashboard.js — refreshes the dashboard from CSV + markdown, then stages
 * a self-contained copy in coffee leads/deploy/ ready to push to Netlify.
 *
 * Run:  node _automation/state/deploy-dashboard.js
 *
 * What it does (in order):
 *   1. Runs compile-dashboard.js → refreshes the main coffee leads/Dashboard.html
 *   2. Copies that file into coffee leads/deploy/Dashboard.html
 *   3. Strips the ../_automation/... relative footer links (they'd 404 on the web)
 *      and replaces them with plain text labels
 *   4. Writes coffee leads/deploy/index.html (redirects to Dashboard.html)
 *   5. Writes coffee leads/deploy/_redirects (Netlify routing config)
 *   6. Prints the deploy command (Netlify CLI if installed, drag-drop instructions otherwise)
 *
 * No dependencies. The actual `netlify deploy` step is left to you — it needs your login.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const COMPILE_SCRIPT = path.join(ROOT, '_automation', 'state', 'compile-dashboard.js');
const SOURCE_HTML = path.join(ROOT, 'coffee leads', 'Dashboard.html');
const DEPLOY_DIR = path.join(ROOT, 'coffee leads', 'deploy');
const DEPLOY_HTML = path.join(DEPLOY_DIR, 'Dashboard.html');
const DEPLOY_INDEX = path.join(DEPLOY_DIR, 'index.html');
const DEPLOY_REDIRECTS = path.join(DEPLOY_DIR, '_redirects');

// ===== Step 1: refresh the main dashboard from CSV + markdown =====
function refresh() {
    console.log('1/5  Refreshing dashboard from CSV + markdown...');
    try {
        execSync(`node "${COMPILE_SCRIPT}"`, { stdio: 'inherit', cwd: ROOT });
    } catch (e) {
        console.error('✗ compile-dashboard.js failed — aborting deploy.');
        process.exit(1);
    }
}

// ===== Step 2 + 3: copy + strip relative links =====
function stageDeployCopy() {
    if (!fs.existsSync(SOURCE_HTML)) {
        console.error('✗ Missing source: ' + SOURCE_HTML);
        process.exit(1);
    }
    if (!fs.existsSync(DEPLOY_DIR)) fs.mkdirSync(DEPLOY_DIR, { recursive: true });

    console.log('2/5  Copying Dashboard.html into deploy/...');
    let html = fs.readFileSync(SOURCE_HTML, 'utf8');

    console.log('3/5  Stripping relative footer links (they 404 on the web)...');
    // Replace the footer links block with plain text labels
    // The source footer is a <div> containing <a href="../_automation/..."> tags
    html = html.replace(
        /<div>\s*\n\s*<a href="\.\.\/_automation\/state\/lead-pipeline\.csv">Pipeline CSV<\/a> ·\s*\n\s*<a href="Cinn-Coffee-Leads\.md">Full leads doc<\/a> ·\s*\n\s*<a href="\.\.\/_automation\/output\/[^"]+">[^<]+<\/a> ·\s*\n\s*<a href="\.\.\/_automation\/output\/[^"]+">[^<]+<\/a>\s*\n\s*<\/div>/,
        `<div>\n                PIPELINE CSV · FULL LEADS DOC · MORNING BRIEFS — see them on your laptop in _automation/\n            </div>`
    );
    // Safety net: if any ../_automation links survived, strip them too
    html = html.replace(/<a href="\.\.\/_automation[^"]*">([^<]+)<\/a>/g, '$1');
    // And any standalone Cinn-Coffee-Leads.md link (relative, would 404)
    html = html.replace(/<a href="Cinn-Coffee-Leads\.md">([^<]+)<\/a>/g, '$1');

    fs.writeFileSync(DEPLOY_HTML, html, 'utf8');
    return html;
}

// ===== Step 4: write index.html redirect =====
function writeIndex() {
    console.log('4/5  Writing index.html (redirects to Dashboard.html)...');
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=Dashboard.html">
<title>Cinn — Leads Dashboard</title>
<link rel="canonical" href="Dashboard.html">
</head>
<body>
Redirecting to <a href="Dashboard.html">Dashboard.html</a>…
</body>
</html>
`;
    fs.writeFileSync(DEPLOY_INDEX, indexHtml, 'utf8');
}

// ===== Step 5: write _redirects (Netlify routing) =====
function writeRedirects() {
    console.log('5/5  Writing _redirects (Netlify config)...');
    // Netlify: any unknown path falls back to the dashboard so the URL always works
    fs.writeFileSync(DEPLOY_REDIRECTS, '# Netlify redirects\n/*  /Dashboard.html  200\n', 'utf8');
}

// ===== Print deploy instructions =====
function printInstructions() {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('  DEPLOY FOLDER READY: coffee leads/deploy/');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    const hasNetlifyCli = (() => {
        try { execSync('netlify --version', { stdio: 'ignore' }); return true; }
        catch { return false; }
    })();

    if (hasNetlifyCli) {
        console.log('✓ Netlify CLI detected. To deploy:');
        console.log('');
        console.log('    netlify deploy --prod --dir="coffee leads/deploy"');
        console.log('');
        console.log('  (First time only: run `netlify login` first, then `netlify deploy --prod`.)');
    } else {
        console.log('TWO WAYS TO DEPLOY:');
        console.log('');
        console.log('  Option A — drag & drop (easiest, no install):');
        console.log('    1. Open  https://app.netlify.com/drop');
        console.log('    2. Drag the folder  coffee leads/deploy/  onto the page');
        console.log('    3. Copy the URL it gives you');
        console.log('');
        console.log('  Option B — Netlify CLI (faster for redeploys):');
        console.log('    npm install -g netlify-cli     # one-time install');
        console.log('    netlify login                  # one-time auth');
        console.log('    netlify deploy --prod --dir="coffee leads/deploy"');
    }
    console.log('');
    console.log('AFTER FIRST DEPLOY — generate a QR code for your phone:');
    console.log('    node _automation/state/make-qr.js https://your-site.netlify.app');
    console.log('');
    console.log('See coffee leads/DEPLOY.md for the full runbook.');
}

// ===== Main =====
function main() {
    refresh();
    stageDeployCopy();
    writeIndex();
    writeRedirects();
    printInstructions();
}

main();
