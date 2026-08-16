#!/usr/bin/env node
/**
 * make-qr.js — generates a QR code PNG for a URL, saved into coffee leads/deploy/.
 *
 * Run AFTER your first Netlify deploy, with your site URL:
 *     node _automation/state/make-qr.js https://your-site.netlify.app
 *
 * Output: coffee leads/deploy/QR.png (300x300, scannable by any phone camera)
 * Also opens the QR in your default browser so you can scan it from your screen.
 *
 * No dependencies. Uses the public api.qrserver.com endpoint.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..', '..');
const DEPLOY_DIR = path.join(ROOT, 'coffee leads', 'deploy');
const OUT_FILE = path.join(DEPLOY_DIR, 'QR.png');

const url = process.argv[2];

if (!url || !/^https?:\/\//i.test(url)) {
    console.error('');
    console.error('✗ Usage: node _automation/state/make-qr.js https://your-site.netlify.app');
    console.error('  Pass the full URL of your deployed dashboard.');
    console.error('');
    process.exit(1);
}

if (!fs.existsSync(DEPLOY_DIR)) fs.mkdirSync(DEPLOY_DIR, { recursive: true });

const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(url)}`;

console.log(`Fetching QR code for: ${url}`);

const file = fs.createWriteStream(OUT_FILE);
https.get(qrApiUrl, (res) => {
    if (res.statusCode !== 200) {
        console.error(`✗ QR API returned HTTP ${res.statusCode} — check your connection and try again.`);
        fs.unlinkSync(OUT_FILE);
        process.exit(1);
    }
    res.pipe(file);
    file.on('finish', () => {
        file.close(() => {
            const sizeKb = Math.round(fs.statSync(OUT_FILE).size / 1024);
            console.log('');
            console.log(`✓ QR code saved: coffee leads/deploy/QR.png (${sizeKb} KB)`);
            console.log(`  Encoded URL: ${url}`);
            console.log('');
            console.log('NEXT:');
            console.log('  1. Open coffee leads/deploy/QR.png on your laptop');
            console.log('  2. Scan it with your phone camera');
            console.log('  3. Bookmark the page on your phone');
            console.log('');
            // Try to open the PNG in the default viewer
            const openCmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
            try {
                require('child_process').execSync(`${openCmd} "${OUT_FILE}"`, { stdio: 'ignore' });
                console.log('  (QR.png opened on screen — scan it now.)');
            } catch { /* ignore — they can open it manually */ }
        });
    });
}).on('error', (e) => {
    console.error(`✗ Network error: ${e.message}`);
    if (fs.existsSync(OUT_FILE)) fs.unlinkSync(OUT_FILE);
    process.exit(1);
});
