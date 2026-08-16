# Build Brief — 2026-08-05

Two Tier-2 games built to clear the §4 TBD backlog. No existing files modified.

## Games built

### 1. Perfect Pour
- **Path:** `Tier-2/Perfect-Pour.html`
- **Tier:** 2 (£149/mo — Gamified Upsell)
- **Reference template:** `Tier-2/Scratch-and-Match.html` (visible attempt tracking + close-call result copy)
- **Mechanic:** Hold-and-release reflex. Player holds the POUR button; a stream fills a glass. Release inside the red target zone (60–80% fill) to win. Fill overshoots to 100% if held too long.
- **Win gate:** `success-or-3-misses`. 3 attempt dots tracked in-UI. Win copy = "PERFECT POUR!"; 3-miss copy = "SO CLOSE!" (still issues a consolation code — matches the base-tier lead-capture intent).
- **Game-specific payload fields:** `attempts` (int), `result` ("win" | "close-call").

### 2. Coffee Slots
- **Path:** `Tier-2/Coffee-Slots.html`
- **Tier:** 2 (£149/mo — Gamified Upsell)
- **Reference template:** `Tier-2/Spin-the-Wheel.html` (CSS-driven prize imagery, button-triggered reveal)
- **Mechanic:** 3-reel slot. Tapping SPIN starts all reels spinning; each subsequent tap stops the next reel sequentially (reel 0 → 1 → 2). Match all 3 = jackpot; match any 2 = win; no match = miss.
- **Win gate:** `success-or-3-misses`. 3 spin attempts tracked. Win copy = "JACKPOT!"; 3-miss copy = "SO CLOSE!" with consolation code.
- **Game-specific payload fields:** `attempts` (int), `result` ("win" | "close-call").

## Checklist (both files)
- [x] File ends with clean `</html>` (no trailing whitespace/chars).
- [x] `:root` has all 4 brand tokens (`--bg-green`, `--dark-green`, `--white`, `--warning-red`).
- [x] Oswald loaded from Google Fonts (400;500;700).
- [x] All-caps on headings, labels, buttons, inputs, warnings.
- [x] Three states present; only `#play-state` visible on load; toggled via `display` only.
- [x] `#cafe-name-placeholder` wired to `CAFE_NAME`.
- [x] `generateReward()` and webhook submit match the canonical pattern verbatim.
- [x] Webhook URL is the placeholder (`REPLACE-WITH-REAL-WEBHOOK`).
- [x] Mechanic + win-gate logic match the spec.
- [x] Every `<img>` has an `onerror` fallback.
- [x] Filename is `Title-Case-With-Dashes.html`.

## Stubbed / known limitations
- **Webhook:** placeholder URL — needs a real Make.com webhook per game before going live.
- **Expiry:** cosmetic, client-side only (by design for base tier — not enforced).
- **Fraud prevention:** minimal — codes are dummy, single-use is on the honour system. Tier 3's Google-Sheet validator is still unbuilt.
- **Imagery:** uses the canonical 5-item imgbb set (Matcha, Iced Coffee, Espresso, Cheesecake, Croissant) for prize wins. No new image slots required, so no Cortado/Americano/Cinnamon-Bun URLs were introduced.
- **Naming note:** First state is `id="play-state"`, matching the two Tier-2 reference games (Scratch-and-Match, Spin-the-Wheel) rather than the AGENTS.md skeleton's `id="select-state"`. Chosen for architectural consistency with the file's neighbours.

## How to review
- Open `Tier-2/Perfect-Pour.html` in a browser. Hold POUR, release near the top of the red band. Play through to win, then refresh and miss 3× for the consolation flow.
- Open `Tier-2/Coffee-Slots.html` in a browser. Tap SPIN, then tap 3× to stop each reel. Confirm matching reels get the red `win` outline and that a no-match after 3 spins still reaches the gate.

## Portfolio status after this build
| Game | Tier | Status |
|---|---|---|
| Perfect Pour | 2 | ✅ Built (was TBD) |
| Coffee Slots | 2 | ✅ Built (was TBD) |
| Coffee Horoscope | 1 | 🔨 Still TBD |
| Referral Loop | 3 | 🔨 Still TBD |

No human action required for these two files beyond the standard pre-live webhook wiring. Next TBD slot to clear would be the Tier-1 Coffee Horoscope (lead-magnet, `always` gate) or the Tier-3 Referral Loop (new mechanic — would need a fresh spec).
