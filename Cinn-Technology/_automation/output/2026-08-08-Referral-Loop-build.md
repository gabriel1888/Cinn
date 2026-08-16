# Build Brief — 2026-08-08

## Game built: Referral Loop ("Gift a Mystery Treat")

- **Path:** `Tier-3/Referral-Loop.html`
- **Tier:** 3 (£199/mo — Viral Growth Engine)
- **Reference template:** Spin-the-Wheel / Scratch-and-Match (3-state flow, gate, result, canonical reward + webhook)
- **Concept:** A customer-to-customer viral loop. Customer taps a wrapped gift to reveal a mystery treat, enters email, and receives TWO codes: their own treat + a gift code to text a friend. Both codes are dummy (honour-system barista verification).

### Strategic rationale
Replicates Blank Street's dual-sided referral program, which drove **28% of their new-user acquisition** and cut CAC from $48 (paid ads) to $12. Blank Street's model requires an app + payments infrastructure; Cinn's version delivers the same acquisition lever via QR-only, no-backend games — the cafe owner's competitive moat without the $100k build.

### Mechanic
- **Win gate:** `always` (lead-magnet style — any unwrap proceeds to the gate).
- **Interaction:** Tap a wrapped gift box (inline SVG, brand palette) → CSS animation (scale + rotate + fade) over ~1.1s → reveals a mystery treat (random from the canonical 5-item imgbb set) → transitions to gate.
- **Result state:** Two stacked code blocks:
  1. **"YOUR TREAT CODE"** — referrer's code, standard format, 7-day cosmetic expiry, single-use warning.
  2. **"GIFT TO A FRIEND"** — a distinct second code, visually differentiated (`--dark-green` background, solid border vs. dashed), with hint copy: "Text this to a friend. They'll get the same treat on their next visit."

### Reward generation (dual codes)
The canonical `generateReward()` from AGENTS.md §3 was refactored into `buildReward()` — same format logic (`{prefix}-{4-digit}-{2-char}`, 7-day expiry) but returns the code+expiry as an object instead of writing to a fixed element ID. Called **twice** on submit: once for the referrer code, once for the gift code. Both codes are mathematically guaranteed distinct (random generation, effectively zero collision risk at this scale).

### Game-specific payload fields
`prize_won`, `referrer_code`, `gift_code` (in addition to canonical `cafe`/`email`/`marketing_consent`/`date`/`source:"Referral Loop"`). Single webhook fire carries both codes so the cafe owner can track viral acquisition in their Make.com dashboard.

## Checklist
- [x] File ends with clean `</html>` (no trailing whitespace/chars).
- [x] `:root` has all 4 brand tokens (`--bg-green`, `--dark-green`, `--white`, `--warning-red`).
- [x] Oswald loaded from Google Fonts (400;500;700).
- [x] All-caps on headings, labels, buttons, inputs, warnings.
- [x] Three states present; only `#select-state` visible on load; toggled via `display` only.
- [x] `#cafe-name-placeholder` wired to `CAFE_NAME`.
- [x] `generateReward()` pattern preserved (refactored to `buildReward()` for dual-code return; format identical).
- [x] Webhook submit matches canonical pattern verbatim (mode:'no-cors', try/catch/finally).
- [x] Webhook URL is the placeholder (`REPLACE-WITH-REAL-WEBHOOK`).
- [x] Every `<img>` has `onerror` fallback.
- [x] Filename is `Title-Case-With-Dashes.html`.
- [x] Gift-wrap is inline SVG (brand palette, no external asset).

## Verification
Driven end-to-end in the in-app browser:
- Initial state: "GIFT A MYSTERY TREAT" heading, wrapped gift SVG, "TAP THE GIFT" hint.
- Tap gift → animation → gate appeared with "YOU WON A ESPRESSO!", dual-reward subtitle, email form.
- Submit email → result showed BOTH codes: `MA-5950-EO` (treat) + `MA-7092-UM` (gift). Codes distinct, both match canonical format, 7-day expiry correct. Treat name carried through to result.

## Stubbed / known limitations
- **Webhook:** placeholder URL — needs the real Make.com URL before going live. (Tier-2 games + Persona-Test use a live `hook.eu2.make.com/wjl53jpu3lwmwaxr5w7hd2fx3bwgmrim`; flag if this should match.)
- **No referee landing page / shareable link:** by design. The friend receives a code via text and shows it to the barista (honour system). No URL params, no second entry state. Matches Cinn's QR-only, no-backend philosophy.
- **No fraud prevention:** both codes are client-side dummy codes. The Google-Sheet validator (AGENTS.md §3) is a separate unbuilt Tier-3 feature — out of scope for this build.
- **No referrer attribution tracking:** the webhook logs both codes but doesn't link a specific gift code back to the referrer who generated it (no persistent storage). True attribution would need the Sheet validator.

## Portfolio status after this build
| Game | Tier | Status |
|---|---|---|
| Persona-Tap | 1 | ✅ Built |
| Persona-Test | 1 | ✅ Built |
| Mood Match | 1 | ✅ Built (2026-08-08) |
| Coffee Horoscope | 1 | 🔨 Still TBD |
| Scratch-and-Match | 2 | ✅ Built |
| Spin-the-Wheel | 2 | ✅ Built |
| Knots-and-Crosses | 2 | ✅ Built |
| Perfect Pour | 2 | ✅ Built (input-path unverified — see 2026-08-06 thread) |
| Coffee Slots | 2 | ✅ Built (verified 2026-08-06) |
| **Referral Loop** | **3** | **✅ Built (2026-08-08)** |

**Tier 3 is no longer TBD.** The only remaining unbuilt game is Coffee Horoscope (Tier 1). All three tiers now have at least one shippable game.

## Out of scope (flagging, not done)
- Did NOT add "Referral Loop" as a `game_type` option in `Tier-3-Form.html` — that's a separate change to the B2B setup form.
- Did NOT build the Google-Sheet code validator (separate unbuilt feature per AGENTS.md).
- Did NOT update `index.html` marketing copy (the Tier-3 card still says "COMING SOON" with a placeholder image).
