# AGENTS.md — Cinn Project Playbook

> **Read this first.** Every agent working in this repo reads this file before doing anything else. It is the single source of truth for brand, code conventions, and voice. Do not re-derive these from the code — code may drift; this file is canonical.

---

## 1. What Cinn is

**Cinn** gives indie cafes the same lead-capture power as big chains (Starbucks, Blank Street) without the $100k app development.

**The mechanism:** sleek, gamified QR codes placed on the cafe counter. Customers play a 5-second game while waiting for their coffee and voluntarily hand over their email to claim a prize/discount.

**Business model:** B2B SaaS. Cafes pay £99–£299/mo. Cinn builds, hosts, and QR-codes a custom game per client. Fulfilment target: 3 minutes per client once templated.

**Aesthetic:** minimalist, premium "Art Gallery" vibe. Think gallery wall, not arcade.

---

## 2. Brand spec (non-negotiable)

### Colors
| Token | Hex | Use |
|---|---|---|
| Pistachio Green | `#4a7a5e` | Primary background, `--bg-green` |
| Dark Green | `#3d6a52` | Secondary surface, `--dark-green` |
| White | `#FFFFFF` | Text on green, `--white` |
| Warning Red | `#FF6B6B` | Single-use / loss states, `--warning-red` |

Always define these as CSS custom properties on `:root`:
```css
:root {
    --bg-green: #4a7a5e;
    --dark-green: #3d6a52;
    --white: #FFFFFF;
    --warning-red: #FF6B6B;
}
```

### Typography
```css
font-family: "ITC Franklin Gothic LT", "Oswald", "Franklin Gothic Medium", Arial, sans-serif;
```
- **ITC Franklin Gothic LT** is the licensed primary (rarely actually loaded in practice).
- **Oswald** (Google Fonts) is the real rendering font. Always load it: weights 400, 500, 700 minimum; 300–700 for forms.
- All user-facing copy is **UPPERCASE** via `text-transform: uppercase` with `letter-spacing` for the tracked, premium feel. Headings, labels, buttons, inputs, warnings — everything.

### Layout patterns
- Single self-contained `.html` files (inline `<style>` + inline `<script>`). No build step.
- Mobile-first. Container `max-width: 420px` for games, `max-width: 1024px` for landing.
- `clamp()` for fluid type. `flex` for layouts.
- Three-state flow in every game: `#select-state` → `#gate-state` → `#result-state`, toggled via `display: flex/none`.

---

## 3. Code conventions

### File structure
```
Cinn-Technology/
├── AGENTS.md                ← you are here
├── Landing-Page.html
├── Tier-1/                  ← £99/mo: Persona-Tap, Persona-Test, (Horoscope TBD)
├── Tier-2/                  ← £149/mo: Scratch-and-Match, Spin-the-Wheel, Knots-and-Crosses, (Perfect Pour, Slots TBD)
├── Tier-3/                  ← £199/mo: referral loop (TBD)
├── Tier-*/Tier-*-Form.html  ← B2B setup form for each tier
└── _automation/             ← scheduled-agent inputs/outputs/state (don't touch unless you're an automation run)
```

### Every game file follows this skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cinn — [Game Name]</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root { --bg-green:#4a7a5e; --dark-green:#3d6a52; --white:#FFFFFF; --warning-red:#FF6B6B; }
        /* ...game styles... */
    </style>
</head>
<body>
    <div class="app-container">
        <div id="select-state" class="state" style="display:flex"><!-- game UI --></div>
        <div id="gate-state"   class="state" style="display:none"><!-- email capture --></div>
        <div id="result-state" class="state" style="display:none"><!-- prize + code --></div>
    </div>
    <script>
        const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/REPLACE-WITH-REAL-WEBHOOK';
        const CAFE_NAME = 'Maple Street Coffee';
        const cafeNamePlaceholder = document.getElementById('cafe-name-placeholder');
        if (cafeNamePlaceholder) cafeNamePlaceholder.textContent = CAFE_NAME;
        // ...game logic, generateReward(), webhook submit...
    </script>
</body>
</html>
```

### Prize / code logic (the canonical pattern)
```js
function generateReward() {
    const prefix = CAFE_NAME.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 2; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    const finalCode = `${prefix}-${randomNum}-${suffix}`;
    const expireDay = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const formattedExpiry = expireDay.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    document.getElementById('final-code').innerText = finalCode;
    document.getElementById('expiry-date').innerText = `Valid for 7 days (Expires ${formattedExpiry})`;
}
```

### Webhook submit pattern (the canonical pattern)
```js
const payload = { cafe: CAFE_NAME, email, /* game-specific fields */, marketing_consent, code: document.getElementById('final-code').innerText, date: new Date().toISOString(), source: "[Game Name]" };
try {
    await fetch(MAKE_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), mode:'no-cors' });
} catch (error) {
    console.error('Webhook error:', error);
} finally {
    document.getElementById('gate-state').style.display = 'none';
    document.getElementById('result-state').style.display = 'flex';
}
```

### ⚠️ Known gotchas (do NOT "fix" these without explicit instruction — they're tracked issues)
- **`mode: 'no-cors'`** strips the JSON Content-Type and makes the response opaque. This is a known systemic bug across all files. Leave as-is unless told to wire real webhooks.
- **Webhook URLs are placeholders** (`your-*-webhook`). Don't replace unless given a real URL.
- **7-day expiry is cosmetic** (client-side only, never enforced). This is by design for the base tier.
- **Fraud prevention is intentionally minimal** in the base tier (dummy codes). Tier 3's Google-Sheet validator is a separate unbuilt feature.

### Image hosting
Product images are hosted on **imgbb** (`https://i.ibb.co/...`). The canonical set:

| Slot | imgbb URL |
|---|---|
| Espresso / Purist | `https://i.ibb.co/KzzxHtQf/pngtree-hot-cappuccino-coffee-cup-with-latte-art-isolated-on-transparent-background-png-image-196075.webp` |
| Matcha / Maverick | `https://i.ibb.co/TDC1PTNX/pngtree-iced-matcha-latte-in-a-plastic-cup-png-image-16393408.png` |
| Cheesecake / Aesthete | `https://i.ibb.co/cPVqnwJ/pngtree-slice-of-pistachio-cheesecake-png-image-15962270.png` |
| Iced Coffee / CAFE | `https://i.ibb.co/0yznsCGP/pngtree-cold-brewed-iced-latte-coffee-on-plastic-cup-side-view-generative-png-image-10154258.png` |
| Croissant | `https://i.ibb.co/sdkNJv61/Gemini-Generated-Image-fssy3zfssy3zfssy-1.png` |

**Reserved for new games only** (do NOT add to existing Spin-the-Wheel / Scratch-and-Match / Landing-Page — those lineups are final unless explicitly changed):

| Slot | imgbb URL |
|---|---|
| Cortado | `https://i.ibb.co/gZkR388b/Gemini-Generated-Image-kvg0ovkvg0ovkvg0-1.png` |
| Americano | `https://i.ibb.co/JRL0tK0v/Americano.png` |
| Cinnamon Bun | `https://i.ibb.co/7JT5nmHb/Cinnamon-Bun.png` |

- ❌ Never use the old `z-cdn-media.chatglm.cn` signed URLs — those auth tokens expire and break silently. They have all been replaced.
- For new/placeholder images, use inline SVG with the brand palette, or `https://placehold.co/200x250/4a7a5e/FFFFFF?text=ITEM&font=oswald`.
- Every `<img>` must have an `onerror` fallback so a dead link shows a graceful placeholder, not a broken icon.

### Conventions
- Filenames: `Title-Case-With-Dashes.html` (e.g. `Spin-the-Wheel.html`, not `spin_the_wheel`).
- Folders: `Tier-1`, `Tier-2`, `Tier-3` (not "Teir").
- `#cafe-name-placeholder` spans must always be wired to `CAFE_NAME` in the script.
- End every file with a clean `</html>` (no trailing whitespace/chars).

---

## 4. The product portfolio

| Game | Tier | Status | Mechanic |
|---|---|---|---|
| Persona-Tap | 1 | ✅ Built | 1-tap image pick → persona result |
| Persona-Test | 1 | ✅ Built | 3-question quiz → scored persona |
| Coffee Horoscope | 1 | 🔨 TBD | Daily replayable fortune teller |
| Scratch-and-Match | 2 | ✅ Built | 3×3 canvas scratch, find 3 matches |
| Spin-the-Wheel | 2 | ✅ Built | CSS pie wheel, decelerates to prize |
| Knots-and-Crosses | 2 | ✅ Built | Tic-tac-toe vs heuristic AI |
| Perfect Pour | 2 | 🔨 TBD | Hold-and-release reflex, 3-try logic |
| Coffee Slots | 2 | 🔨 TBD | 3-reel sequential stop |
| Referral Loop ("Gift a Mystery Treat") | 3 | 🔨 TBD | Customer-to-customer viral loop |

### Pricing
- **Tier 1 — Lead Magnet:** £99/mo
- **Tier 2 — Gamified Upsell:** £149/mo (most popular)
- **Tier 3 — Viral Growth Engine:** £199/mo
- **Tier 4 — Fully Managed:** £299/mo

---

## 5. Voice & tone (for outreach + content)

Cinn sounds like a **confident, premium, slightly playful gallery curator** — not a chirpy marketer, not a corporate SaaS bot.

### Rules
- **UPPERCASE for headlines and CTAs** (matches the brand), but email body copy can be sentence case for readability.
- Short, punchy sentences. No fluff opener ("Hope you're well!"). Get to the value in line 1.
- Specific > generic. Reference *their* menu, *their* aesthetic, *their* neighborhood — never "dear cafe owner."
- One CTA per message. Soft: "10-min demo next week?" Not "sign up now."
- British spelling (colour, favourite, programme). £ not $.
- Never aggressive, never desperate, never "act now!!!"
- Humour is dry, not zany.

### Example cold-email opening (good)
> Your matcha grid on IG is gorgeous — and the reason 200 people a day walk past it without leaving an email.

### Example (bad — do not write like this)
> Hi there! I hope this email finds you well. My name is X and I'm the founder of Cinn, a revolutionary new SaaS platform that's disrupting the cafe loyalty space...

---

## 6. For scheduled automation runs

If you are a scheduled agent firing from `_automation/`, you have no conversation memory. Read this file, then read your specific prompt in `_automation/templates/`, then read whatever state files your prompt names. Write outputs to `_automation/output/` with today's date prefix (`YYYY-MM-DD-`).

**You never:**
- Send emails, DMs, or any outbound message.
- Log into any account (Instagram, Gmail, anything).
- Scrape behind logins or pull private data.
- Modify the 9 existing game files unless your prompt explicitly says to.
- Push to git or deploy anywhere.

**You always:**
- Date-stamp output files.
- Append (never overwrite) `lead-pipeline.csv`.
- Update `rotation-state.json` atomically.
- Leave a clean morning brief explaining what you did and what needs human action.
