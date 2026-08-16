# Cinn — Trigger-Event Brief · 2026-08-10

> ⚠️ **TEST FIRE** — first run of the trigger-event automation. Eyeball the output before scheduling daily. Produced to confirm the pipeline works end-to-end.

---

## Today's trigger
**Strategy:** `slow_season` (calendar override — August is peak UK city-centre slow season)
**City:** London
**Why today:** August calendar override fired. London city-centre commuter footfall thins sharply; the customers indies DO have are the asset. Referral-loop value prop leads.

## Pipeline summary
| Stage | Count |
|---|---|
| Candidates sourced (WebSearch + Overpass + BrewAtlas listicle) | ~25 named indies |
| After chain filter | ~24 |
| After dedupe (CSV was empty — first run) | 24 |
| After vibe-read enrichment (website/email/IG confirmed) | 10 viable |
| **Top 10 selected** | **10** |
| DM scripts produced | 5 |

## Top 10 (trigger-drafted: 1–5, trigger-researched: 6–10)
| # | Cafe | Score | Tier | IG | Hook | DM script |
|---|---|---|---|---|---|---|
| 1 | **Kiss the Hippo** (Covent Garden/Fitzrovia) | 9 | 2 | @kissthehippo | August dip + new matcha lineup — the exact moment a counter game pays for itself | [script](2026-08-10-trigger-slow_season-kissthehippo.md) |
| 2 | **Calico** (Waterloo) | 8 | 2 | @calico_coffee_uk_ | Waterloo commuter footfall thins; the customers they DO have are the asset | [script](2026-08-10-trigger-slow_season-calico.md) |
| 3 | **Special Guests** (Marylebone) | 8 | 1 | @specialguestscoffee | Marylebone August lull; competition-lot craft story suits Persona-Tap | [script](2026-08-10-trigger-slow_season-specialguests.md) |
| 4 | **Prufrock** (Farringdon/Holborn) | 8 | 1 | @prufrockcoffee | Holborn is London's most commuter-dependent pocket; August thin-out is sharp | [script](2026-08-10-trigger-slow_season-prufrock.md) |
| 5 | **Ozone** (Shoreditch) | 7 | 2 | @ozonecoffeeuk | Shoreditch August lull — matcha + food lineup is upsell-rich; referral game earns its keep | [script](2026-08-10-trigger-slow_season-ozonecoffee.md) |
| 6 | Rosslyn Coffee (City) | 7 | 1 | @rosslyncoffee | Royal Exchange = pure City commuter traffic; "best new cafés in the world" — don't waste the spike without a list | — |
| 7 | Monmouth (Borough/CG) | 7 | 1 | @monmouthcoffee | Tourist traffic masks the regular drop; every walk-out without an email is a loss | — |
| 8 | Nostos (Battersea/St James's) | 5 | 1 | @nostos.coffee | Two-site indie, Greek specialty angle. ⚠️ website down — verify before outreach | — |
| 9 | Nowhere / Dark Arts @ Aries (Soho) | 5 | 2 | @darkartscoffee | Soho August lull; roaster collab spot. IG DM only (no public site/email) | — |
| 10 | Turk's Head Cafe (Wapping) | 5 | 2 | @theturksheadwapping | Wapping all-day spot; bistro menu suits Spin-the-Wheel for broad upsell variety | — |

## Your action (~10 min)
1. **Cluster:** add the top 5 drafted cafes to a Close Friends list (these are all central-London city-centre indies hit by August — a real common thread).
2. **Post:** the cluster story. Use the slow-season frames from any of the 5 script files (they share the same template — referral-loop + "the customers you have are the asset").
3. **Reply today:** fire the 5 "First DM" lines as replies to *their* stories today (lands in Primary inbox, not Requests). Each is a real reaction to their content + a question. No pitch.
4. **Remove after 24h:** take them off Close Friends once the story expires.
5. **Log outcome** in the CSV `notes` field: `engaged` / `soft-reply` / `no-reply` / `muted`.

## Rotation status
- **Today:** `slow_season` in London (August override)
- **Next run:** resumes normal rotation → `chain_nearby` (strategy index 0) in **Manchester** (city index 1)
- **Override already applied** this August — won't fire again until August 2027

## Honest notes from this test fire
1. **Sourcing worked** — WebSearch + the BrewAtlas 2026 listicle gave a stronger, richer shortlist than OSM alone. Overpass returned 68 named indies in the London bbox but almost none carried IG/email tags (same finding as the 2026-08-05 city-rotation test fire — OSM tags are thin in the UK). The listicle + per-cafe WebFetch vibe reads were where the real enrichment came from.
2. **Dead sites happen.** Nostos's `www.nostoscoffee.com` returned ENOTFOUND — flagged in the CSV notes and demoted. Verify handle `@nostos.coffee` and find a working site before any outreach.
3. **All 10 IG handles are public-source confirmed** (from each cafe's own site or the listicle) — no handles were guessed. Two cafes (Kiss the Hippo, Prufrock) also had public emails; the rest are DM-first.
4. **The August override fired correctly** — strategy index stayed at 0 so `chain_nearby` runs next, city advanced to Manchester.
5. **CSV integrity verified** programmatically — all 10 rows are 14 columns wide, IG handles in the `instagram` column (not email), quoted address fields parse cleanly.
6. **Ready to schedule** once you've eyeballed the DM scripts. Suggest: daily 7am UK, weekdays only, so it's waiting in `_automation/output/` when you wake up.
