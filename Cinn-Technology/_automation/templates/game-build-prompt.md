# Missing-Game Build — Scheduled Run Prompt

You are a scheduled automation running for **Cinn**. You have no conversation memory. You build ONE missing game per run, matching the existing code style pixel-for-pixel. Work in `C:\Users\gabri\OneDrive\Desktop\Cinn-Technology`.

## Step 0 — Load context
1. Read `AGENTS.md` (brand spec, code conventions, prize logic, webhook pattern — §2, §3, §4).
2. Check which games still need building by listing the tier folders and comparing against the portfolio in AGENTS.md §4.

## Step 1 — Pick the next game to build
Build in this priority order. Build the **first one that doesn't already exist** in its tier folder:
1. **Coffee Horoscope** → `Tier-1/Horoscope.html` (if missing)
2. **Perfect Pour** → `Tier-2/Perfect-Pour.html` (if missing)
3. **Coffee Slots** → `Tier-2/Coffee-Slots.html` (if missing)

If all three exist, **stop** — write a short note to `_automation/output/YYYY-MM-DD-game-build.md` saying "All 3 missing games are built. This automation is now idle. Ask Gabriel whether to repurpose it (e.g. build A/B variants, port the referral loop, or build Tier-3 games)." Then exit. Do not build extras unbidden.

## Step 2 — Study the reference template
- For a **Tier-1** game: read `Tier-1/Persona-Tap.html` end-to-end. Match its exact CSS structure, state machine, gate, result, `generateReward()`, and webhook submit pattern.
- For a **Tier-2** game: read `Tier-2/Spin-the-Wheel.html` end-to-end. Same — match its structure exactly.

You are matching **style and architecture**, not copying game logic. The new game's mechanic is different.

## Step 3 — Build the game
Write a single self-contained HTML file. Follow the skeleton in AGENTS.md §3 exactly:
- CSS custom properties on `:root` (`--bg-green`, `--dark-green`, `--white`, `--warning-red`).
- Oswald font from Google Fonts.
- All-caps styling throughout.
- Three states: `#select-state` → `#gate-state` → `#result-state`.
- Wire `#cafe-name-placeholder` to `CAFE_NAME` (the canonical pattern from AGENTS.md).
- Reuse the canonical `generateReward()` and webhook submit pattern verbatim (placeholder webhook URL, `mode:'no-cors'` — leave these as-is per the known gotchas).

### Game-specific logic

**Coffee Horoscope** (`Tier-1/Horoscope.html`):
- Daily-replayable fortune teller. On page load, randomise one prophecy from an array of ~24 coffee-themed fortunes (e.g. "A flat white will change your week", "Your crush is thinking about your matcha order", etc. — witty, premium, never cheesy).
- User sees their fortune, then the email gate, then the result (full horoscope + discount code).
- No skill — pure randomisation on load. Replayable means each load shows a different fortune.
- Include a small "🔁 Get another reading" button that re-randomises without requiring email again (after first reveal).

**Perfect Pour** (`Tier-2/Perfect-Pour.html`):
- "Hold and release" reflex game. A cup fills with liquid (animated bar/height) while the user holds the button; release to stop.
- A target line is drawn on the cup. Stop within the target zone to win.
- **3-try logic:** user gets 3 attempts. Track attempts. If they win any attempt → gate → result. If all 3 miss → still show gate (capture email regardless, per the existing pattern), but the result copy reflects "close call."
- Use CSS animation or `requestAnimationFrame` for the fill. Make the target zone reasonable (~15% of cup height).

**Coffee Slots** (`Tier-2/Coffee-Slots.html`):
- 3-reel slot machine. Each reel is a vertical strip of coffee images (espresso, matcha, latte, croissant, etc.) that spins and stops.
- **Sequential stop for suspense:** reel 1 stops first, then reel 2, then reel 3 (~400ms apart).
- Match all 3 → win. Use a weighted outcome: ~30% chance of a 3-match per spin (so it feels achievable but not trivial).
- Reels can be simple CSS transforms (translateY through a repeating image strip) with JS controlling stop timing.
- After the spin resolves → gate → result.

## Step 4 — Use safe placeholder images
For any product imagery, do NOT use the existing `z-cdn-media.chatglm.cn` signed URLs (they'll expire). Use one of:
- Inline SVG placeholders with the brand palette, OR
- `https://placehold.co/200x250/4a7a5e/FFFFFF?text=ITEM&font=oswald` URLs (free, no auth).
Every `<img>` must have an `onerror` fallback.

## Step 5 — Self-review before saving
Before saving, verify against this checklist:
- [ ] File ends with clean `</html>` (no trailing chars).
- [ ] `:root` has all 4 brand tokens.
- [ ] Oswald loaded from Google Fonts.
- [ ] All-caps on headings, labels, buttons, inputs.
- [ ] Three states present, only `#select-state` visible on load.
- [ ] `#cafe-name-placeholder` wired to `CAFE_NAME`.
- [ ] `generateReward()` and webhook submit match the canonical pattern.
- [ ] Webhook URL is the placeholder (don't invent a real one).
- [ ] Game-specific logic matches Step 3's spec.
- [ ] Every `<img>` has `onerror`.
- [ ] Filename matches `Title-Case-With-Dashes.html`.

## Step 6 — Write the build note
Create `_automation/output/YYYY-MM-DD-game-build.md`:
- **Game built:** name, file path, tier.
- **Mechanic summary:** 2-3 lines on how it plays.
- **Reference template used:** which existing game you matched.
- **What's complete:** the checklist above, all ticked.
- **What's stubbed / known limitations:** e.g. "placeholder images not real product shots", "webhook URL is placeholder", "no real fraud prevention (matches existing games)".
- **How to review:** "Open `<path>` in a browser. Play through. If good, it's ready to deploy. If changes needed, tell me what."
- **Next game in queue:** which one builds next run.

## Hard constraints
- ❌ Never modify the 9 existing game files. Only create new ones.
- ❌ Never replace placeholder webhook URLs with invented real ones.
- ❌ Never use the `z-cdn-media.chatglm.cn` signed URLs (expiry risk).
- ❌ Never build more than one game per run.
- ✅ If a game already exists at the target path, skip to the next in priority. If all 3 exist, go idle (Step 1).
