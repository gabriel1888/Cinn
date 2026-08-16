# Cinn Game Creation Prompt (parameterised)

> Reusable prompt for generating ONE new Cinn game file. Fill in the `{{SLOTS}}` below, hand the whole thing to an agent (or a scheduled run), and it produces a single self-contained `Title-Case-With-Dashes.html` game file that matches the existing Cinn style pixel-for-pixel.
>
> Distinct from `game-build-prompt.md`, which is the fixed-queue scheduled automation. This prompt is generic — you supply the spec.

---

## INPUT — fill these in before running

```
{{GAME_NAME}}       e.g. "Perfect Pour"            — display name, used in <title> and headings
{{FILE_NAME}}       e.g. "Tier-2/Perfect-Pour.html" — exact relative path, Title-Case-With-Dashes
{{TIER}}            one of: Tier-1 | Tier-2 | Tier-3
{{CAFE_NAME}}       e.g. "Maple Street Coffee"      — the client cafe; wired to #cafe-name-placeholder
{{MECHANIC}}        1-3 sentence description of the gameplay (see "Mechanic spec" below)
{{PRIZE}}           what the customer wins + any prize-copy notes (drives generateReward + result copy)
{{WIN_CONDITION}}   how the player reaches the gate: "always" (lead magnet), "any success", or "success-or-3-misses"
{{REFERENCE_GAME}}  e.g. "Tier-2/Spin-the-Wheel.html" — the existing game whose style/architecture to match
```

---

## ROLE

You are building ONE new Cinn game. You have no conversation memory beyond this prompt. Working directory: `C:\Users\gabri\OneDrive\Desktop\Cinn-Technology`.

## Step 0 — Load context (do not skip)
1. Read `AGENTS.md` in full — §2 (brand spec), §3 (code conventions, skeleton, `generateReward()`, webhook pattern, known gotchas, image-hosting), §4 (portfolio).
2. Read `{{REFERENCE_GAME}}` end-to-end. You are matching its **style and architecture** (CSS structure, state machine, gate, result, reward logic, webhook submit), not copying its game mechanic.

## Step 1 — Build the file at `{{FILE_NAME}}`

Single self-contained HTML. Follow the AGENTS.md §3 skeleton **exactly**:

- `<meta viewport>`, `<title>Cinn — {{GAME_NAME}}</title>`.
- Google Fonts: Oswald weights 400, 500, 700 (300–700 if forms need it).
- `:root` defines all four tokens:
  ```css
  :root { --bg-green:#4a7a5e; --dark-green:#3d6a52; --white:#FFFFFF; --warning-red:#FF6B6B; }
  ```
- All user-facing copy **UPPERCASE** via `text-transform: uppercase` with `letter-spacing`. Headings, labels, buttons, inputs, warnings — everything.
- Mobile-first. Container `max-width: 420px`.
- `clamp()` for fluid type. `flex` for layouts.

### Mandatory three-state flow (enforced — do not deviate)
```html
<div id="select-state" class="state" style="display:flex"><!-- game UI --></div>
<div id="gate-state"   class="state" style="display:none"><!-- email capture --></div>
<div id="result-state" class="state" style="display:none"><!-- prize + code --></div>
```
Toggle states via `display: flex / none` only. On load, **only** `#select-state` is visible. This flow is non-negotiable regardless of `{{TIER}}` or `{{MECHANIC}}`.

### Script block
```js
const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/REPLACE-WITH-REAL-WEBHOOK';
const CAFE_NAME = '{{CAFE_NAME}}';
const cafeNamePlaceholder = document.getElementById('cafe-name-placeholder');
if (cafeNamePlaceholder) cafeNamePlaceholder.textContent = CAFE_NAME;
```
- Use the canonical `generateReward()` from AGENTS.md §3 verbatim (prefix from CAFE_NAME, 4-digit num, 2-char suffix, 7-day cosmetic expiry).
- Use the canonical webhook submit pattern verbatim (`mode:'no-cors'`, payload with `cafe`/`email`/game-specific fields/`marketing_consent`/`code`/`date`/`source:"{{GAME_NAME}}"`, `finally` flips gate→result).

## Step 2 — Mechanic spec: {{MECHANIC}}

Implement `{{MECHANIC}}` as the `#select-state` interaction. Specific requirements:

- **Win gate logic = `{{WIN_CONDITION}}`:**
  - `always` → any interaction proceeds straight to `#gate-state` (Tier-1 lead-magnet style, like Persona-Tap).
  - `any success` → completing the game successfully proceeds to `#gate-state`.
  - `success-or-3-misses` → on win, OR after 3 failed attempts, proceed to `#gate-state`. Track attempts visibly. Result copy reflects whether they won or it was a "close call" (matches the Scratch-and-Match / Perfect-Pour pattern).
- {{PRIZE}} — wire this into the result-state copy and (if it affects the code) `generateReward()`.

## Step 3 — Imagery (read AGENTS.md §3 "Image hosting" first)
- For product imagery, prefer the **canonical imgbb set** in AGENTS.md if the slot matches (Espresso, Matcha, Cheesecake, Iced Coffee, Croissant). For new games, the reserved Cortado / Americano / Cinnamon Bun URLs are allowed.
- For anything else: inline SVG with the brand palette, or `https://placehold.co/200x250/4a7a5e/FFFFFF?text=ITEM&font=oswald`.
- ❌ Never use the expired `z-cdn-media.chatglm.cn` signed URLs.
- Every `<img>` must have an `onerror` fallback so a dead link shows a graceful placeholder.

## Step 4 — Known gotchas (leave as-is, do NOT "fix")
- `mode:'no-cors'` strips the JSON Content-Type and makes the response opaque — known systemic bug, leave it.
- Webhook URL is a placeholder — do not invent a real one.
- 7-day expiry is cosmetic / client-side only — by design.
- Fraud prevention is intentionally minimal in the base tier.

## Step 5 — Self-review before saving
Tick every box. If any is unticked, fix it before writing.
- [ ] File ends with clean `</html>` (no trailing whitespace/chars).
- [ ] `:root` has all 4 brand tokens.
- [ ] Oswald loaded from Google Fonts.
- [ ] All-caps on headings, labels, buttons, inputs, warnings.
- [ ] Three states present; **only** `#select-state` visible on load; toggled via `display` only.
- [ ] `#cafe-name-placeholder` wired to `CAFE_NAME`.
- [ ] `generateReward()` and webhook submit match the canonical pattern verbatim.
- [ ] Webhook URL is the placeholder.
- [ ] Mechanic matches `{{MECHANIC}}`; win-gate logic matches `{{WIN_CONDITION}}`.
- [ ] Every `<img>` has `onerror`.
- [ ] Filename matches `{{FILE_NAME}}` and is Title-Case-With-Dashes.

## Step 6 — Build note (optional — skip if running interactively)
If running as an automation, write `_automation/output/YYYY-MM-DD-{{FILE_NAME-stem}}-build.md`:
- **Game built:** {{GAME_NAME}}, path, tier.
- **Mechanic summary:** 2-3 lines.
- **Reference template used:** {{REFERENCE_GAME}}.
- **Checklist:** all boxes ticked.
- **Stubbed / limitations:** placeholder webhook, cosmetic expiry, minimal fraud prevention, any placeholder images.
- **How to review:** "Open `{{FILE_NAME}}` in a browser. Play through end to end."

## Hard constraints
- ❌ Never modify any existing game file. Only create the one new file at `{{FILE_NAME}}`.
- ❌ Never replace the placeholder webhook URL with an invented real one.
- ❌ Never use `z-cdn-media.chatglm.cn` URLs.
- ❌ Never break the three-state flow, regardless of mechanic.
- ❌ Never deviate from the brand spec (4 colours, Oswald, all-caps).
- ✅ If `{{FILE_NAME}}` already exists, STOP and say so — do not overwrite.
