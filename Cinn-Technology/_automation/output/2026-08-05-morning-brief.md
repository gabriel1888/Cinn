# Cinn — Morning Brief · 2026-08-05

> ⚠️ **TEST FIRE** — this is a one-off validation run, not a scheduled fire. Produced to confirm the pipeline works before going live.

---

## City
**London** (run 1 of 7 before rotation to Manchester)

## Pipeline summary
| Stage | Count |
|---|---|
| Raw OSM candidates (bbox Central London, Zone 1-3) | 200 |
| With a name | 196 |
| After chain filter (indie only) | 160 |
| After dedupe (none yet — first run) | 160 |
| **Top 10 selected** | **10** |
| Email drafts produced | 2 (test fire — full run does 5) |

## Top 10 (drafted: ranks 1-2, researched: 3-10)

| # | Cafe | Score | Web | IG | Email | Hook |
|---|---|---|---|---|---|---|
| 1 | **TomTom Coffee House** (Belgravia) | 8 | ✅ | ✅ | ✅ `coffee@tomtomcoffee.co.uk` | Allpress espresso + house-baked → Persona-Tap demo fits their craft story |
| 2 | **Turk's Head Cafe** (Bistro Bar Dot) | 8 | ✅ | ✅ | ✅ | All-rounder bistro → Spin-the-Wheel for broad upsell variety |
| 3 | Black Cat Cafe | 6 | ✅ | — | ✅ | Indie classic → Scratch-and-Match |
| 4 | Sawyer & Gray | 6 | ✅ | — | ✅ | Boutique → Persona-Tap |
| 5 | Bar Italia (Soho) | 6 | ✅ | — | — | Soho institution → Spin-the-Wheel |
| 6 | Nkora | 6 | ✅ | ✅ | — | Specialty → Persona-Test (3-question fits a craft audience) |
| 7 | The Broca | 6 | ✅ | — | ✅ | Community cafe → Persona-Tap |
| 8 | The Espresso Room | 6 | ✅ | — | — | ⚠️ site returned 404 on enrichment — flag for manual check |
| 9 | Sista Barista | 5 | — | ✅ | — | IG-only → DM-worthy |
| 10 | The Garrick (LSE) | 4 | ✅ | — | — | University cafe — likely not indie enough, demoted |

## DM-worthy (no public email found)
- **Sista Barista** — IG only, no website. DM via `@sistabarista` (verify handle).
- **Nkora** — has IG + website but no public email; try contact form or IG DM.
- **Bar Italia** — Soho institution, website has no public email; phone or in-person may work better.

## Your action
- **2 email drafts ready to review** (test fire — full run produces 5):
  - `_automation/output/2026-08-05-email-tomtom-coffee-house.md`
  - `_automation/output/2026-08-05-email-turks-head-cafe.md`
- Review, tweak, send from your own inbox. **~5-10 min.**

## Rotation status
- Current city: **London**
- Runs in current city: **1 / 7**
- Next rotation: ~29 Aug (after 7 daily runs)

## Honest notes from this test fire
1. **Overpass works** with the bbox approach (200 cafes, 2.5s response). The original `area[name="London"]` query was broken — now fixed in the prompt template.
2. **Enrichment is thinner than ideal.** Only ~16% of indie cafes have a website listed in OSM, ~3% have Instagram, ~3% have email. The WebFetch step (reading each cafe's actual website) is where most emails and vibe reads will come from — not OSM tags.
3. **Dead sites happen.** The Espresso Room returned 404 on enrichment. The pipeline handled it (flagged, demoted) but didn't crash. Real runs will hit this ~10-15% of the time.
4. **First 5 drafts are achievable** on a full run — today's pool had 8 cafes scoring 6+, easily 5 with enough signal to personalise.
