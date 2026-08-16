# Cinn Leads Dashboard — Deploy to Phone Guide

This is the runbook for getting the dashboard onto your phone via Netlify (free). Once set up, every automation run takes ~30 seconds to push to your phone.

---

## One-time setup (~5 min)

### Step 1 — stage the deploy folder
On your laptop:
```
node _automation/state/deploy-dashboard.js
```
This refreshes `coffee leads/Dashboard.html` from the CSV + markdown, copies it into `coffee leads/deploy/`, strips the laptop-only links, and writes `index.html` + `_redirects`.

### Step 2 — first deploy to Netlify
**Option A — drag & drop (easiest, no install):**
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag the entire **`coffee leads/deploy/`** folder onto the page
3. Netlify gives you a URL like `https://wonderful-tulip-12345.netlify.app`
4. Netlify emails you a claim link to keep the site (don't lose it — claim the site within 24h or it expires)

**Option B — Netlify CLI (faster for future redeploys):**
```
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir="coffee leads/deploy"
```
First deploy asks if you want to create a new site — say yes, accept the random subdomain name.

### Step 3 — open on your phone
1. Copy the URL Netlify gave you
2. Open it in your phone's browser
3. **Bookmark it** / add to home screen

### Step 4 — (optional but worth it) generate a QR code
```
node _automation/state/make-qr.js https://your-site.netlify.app
```
This saves `coffee leads/deploy/QR.png` and opens it on your screen. Scan with your phone camera to jump straight to the dashboard. Keep the PNG somewhere safe — you can re-scan any time.

### Step 5 — (optional) rename to a clean URL
In Netlify's dashboard → **Site settings → Domain management → Change site name** → set it to something like `cinn-leads`. Your URL becomes `https://cinn-leads.netlify.app`. Then re-run Step 4 with the new URL to refresh the QR.

---

## Per-run redeploy (~30 seconds)

After the trigger-event automation fires and writes new leads to the CSV:

```
node _automation/state/deploy-dashboard.js
netlify deploy --prod --dir="coffee leads/deploy"
```

First command refreshes the data + stages the folder. Second pushes to the web. Your phone sees the fresh leads ~10 seconds later — just refresh the page.

**If you used drag-and-drop instead of the CLI:** re-run `node _automation/state/deploy-dashboard.js`, then drag the `coffee leads/deploy/` folder onto Netlify's deploys tab in your site dashboard.

---

## What's read-only vs synced

| Thing on phone | Flows back to agent? |
|---|---|
| Viewing leads, DM scripts, score | ❌ Read-only |
| Tapping a DM script to copy it | ❌ Local copy only (that's fine — you paste into IG) |
| Checking today's action checkboxes | ❌ Per-device `localStorage` — phone keeps its own state, laptop keeps its own |
| Marking a lead "DM sent" / "replied" | ❌ Not yet — that needs the two-way bridge (see below) |

**The checklist not syncing is the trade-off of read-only.** If you check "DM Laura" on your phone, your laptop won't know. That's intentional for v1 — no server, no cost, no auth. If it becomes annoying, that's the trigger to upgrade.

---

## Upgrading to two-way (later, if you want)

If you want status changes on the phone (DM sent / replied / muted) to flow back into the CSV the agent reads, that needs:
- A backend: **Netlify Functions** (free tier, lives next to the static site) + a tiny data store
- Data store options: **Netlify Blobs** (simplest), **Supabase** (free Postgres), or **Firebase** (free)
- The dashboard gains POST calls that write status changes to the store
- The agent reads from the store (or a CSV export) instead of/in addition to the local file

This is a separate project — ~1 day of work. Don't build it until the read-only mirror has proven you actually check it from your phone.

---

## Troubleshooting

**"My phone shows the old dashboard after I redeployed."**
Refresh the page in the phone browser. Mobile Safari/Chrome cache aggressively. If it sticks, add `?v=2` to the URL to bust the cache.

**"Netlify Drop didn't email me a claim link."**
Check spam. If it expired, just re-drag the folder — you'll get a new site. To avoid this, use the CLI (Option B) which ties the site to your login permanently.

**"The footer links don't work on the phone."**
They're meant to be laptop-only (CSV, briefs, markdown live in `_automation/` which doesn't deploy). The deploy copy replaces them with plain text labels telling you where to find them on the laptop.

**"The dashboard is empty / shows no leads."**
Run `node _automation/state/deploy-dashboard.js` — it refreshes from the CSV first. If the CSV is empty, the dashboard will be too.

**"The QR code won't generate."**
The script uses `api.qrserver.com` (public, free). If it's down, generate one manually at [qrcode-monkey.com](https://www.qrcode-monkey.com/) with your dashboard URL, save as `coffee leads/deploy/QR.png`.

---

## File map (what's where)

| File | Purpose |
|---|---|
| `coffee leads/Dashboard.html` | The main dashboard (laptop view, with relative links intact) |
| `coffee leads/deploy/Dashboard.html` | Deploy copy (links stripped, ready for the web) |
| `coffee leads/deploy/index.html` | Redirects Netlify's root URL to Dashboard.html |
| `coffee leads/deploy/_redirects` | Netlify routing config |
| `coffee leads/deploy/QR.png` | Generated QR code (after you run make-qr.js) |
| `_automation/state/compile-dashboard.js` | Refreshes Dashboard.html from CSV + markdown |
| `_automation/state/deploy-dashboard.js` | Runs compile + stages the deploy folder |
| `_automation/state/make-qr.js` | Generates QR.png from a URL |
