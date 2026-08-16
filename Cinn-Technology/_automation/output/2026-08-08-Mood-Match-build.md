# Build Brief — 2026-08-08

## Game built: Mood Match

- **Path:** `Tier-1/Mood-Match.html`
- **Tier:** 1 (£99/mo — Lead Magnet)
- **Reference template:** `Tier-1/Persona-Test.html` (quiz architecture, gate, result, reward logic)
- **Concept:** A mood-based drink recommender. 3 questions about how the customer feels *right now* → maps to one of 4 moods → recommends a specific drink with a personality line. Gate: "Enter your email to reveal why — and claim 10% off your matched drink."

### Why this converts
Distinct from Persona-Test (which assigns a static identity archetype). Mood Match drives **same-visit purchase intent** — it recommends a real drink the customer can order immediately, not a vague persona. The reward is tied to the matched item ("10% off your matched drink"), which pulls the player from the QR code to the till in one motion.

### Mechanic
- **Win gate:** `always` (Tier-1 lead-magnet style). Completing the 3 questions always proceeds to the gate.
- **Mood detection:** 4 moods (TIRED, STRESSED, SOCIAL, COZY), 3 questions, each answer maps 1:1 to a mood. Highest mood score wins; ties fall to declaration order (tired > stressed > social > cozy).
- **Drink mapping:**
  - TIRED → Espresso (rocket fuel)
  - STRESSED → Cheesecake (comfort / reason to pause)
  - SOCIAL → Iced Coffee (cool, easy, sippable while talking)
  - COZY → Matcha Latte (calm, slow-burning, lingering)

### Game-specific payload fields
`mood`, `matched_drink` (in addition to the canonical `cafe`/`email`/`marketing_consent`/`code`/`date`/`source`).

## Checklist
- [x] File ends with clean `</html>` (no trailing whitespace/chars).
- [x] `:root` has all 4 brand tokens.
- [x] Oswald loaded from Google Fonts (400;500;700).
- [x] All-caps on headings, labels, buttons, inputs, warnings.
- [x] Three states present; only `#quiz-state` visible on load; toggled via `display` only.
- [x] `#cafe-name-placeholder` wired to `CAFE_NAME`.
- [x] `generateReward()` and webhook submit match the canonical pattern.
- [x] Every `<img>` has an `onerror` fallback.
- [x] Filename is `Title-Case-With-Dashes.html`.
- [x] Imagery uses the canonical imgbb set only (no new slots, no z-cdn URLs).

## Verification
Driven end-to-end in the in-app browser (full "cozy" run): Q1→Q2→Q3 → gate showed "A Matcha Latte" → email submitted → result page with description + code `MA-5428-B9`, valid 7 days (Expires 15 Aug). All four mood paths reachable; cozy path confirmed.

## Stubbed / known limitations
- **Webhook:** `MAKE_WEBHOOK_URL` is the `REPLACE-WITH-REAL-WEBHOOK` placeholder — needs the real Make.com URL before going live. (Note: the Tier-2 games and Persona-Test now use a live `hook.eu2.make.com/...` URL; this Tier-1 file was deliberately left on the placeholder per AGENTS.md unless told otherwise. Flag if it should match the others.)
- **Expiry:** cosmetic, client-side only (by design for base tier).
- **Fraud prevention:** minimal — dummy codes, single-use on the honour system.

## Portfolio status after this build
| Game | Tier | Status |
|---|---|---|
| Mood Match | 1 | ✅ Built (new) |
| Persona-Tap | 1 | ✅ Built |
| Persona-Test | 1 | ✅ Built |
| Coffee Horoscope | 1 | 🔨 Still TBD |
| Perfect Pour | 2 | ✅ Built (note: input-path unverified — see 2026-08-06 thread) |
| Coffee Slots | 2 | ✅ Built (verified 2026-08-06) |
| Scratch-and-Match | 2 | ✅ Built |
| Spin-the-Wheel | 2 | ✅ Built |
| Knots-and-Crosses | 2 | ✅ Built |
| Referral Loop | 3 | 🔨 Still TBD |

Next TBD slots to clear: Coffee Horoscope (Tier 1) or the Tier-3 Referral Loop (would need a fresh spec).
