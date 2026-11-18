# chat.md — Central Project Memory

> Read this file first at the start of every session or task. Keep it updated whenever new
> project information, files, or instructions arrive. Never delete useful history; when a
> requirement changes, update it and note what it replaced. Do not record assumptions as facts.

_Last updated: 2026-11-18 06:20 UTC_

---

## 1. Project purpose & overview
- **Product (from spec file, 2026-11-18):** A complete, production-ready Vedic Astrology (Jyotish),
  KP, Jaimini, Numerology, Panchanga, Western Astrology and **Gemini AI Astrologer** platform.
- Must be a real product, not a demo/prototype. All values come from real astronomical
  calculations; AI only *interprets* calculated data, never invents positions.
- Primary languages: **Telugu + English** (reports, chart labels). Also Hindi, Tamil, Kannada,
  Malayalam, Sanskrit terminology.
- **Platform stack (fixed by environment):** TanStack Start v1 (React 19, Vite 7), Tailwind CSS v4,
  edge runtime (Cloudflare Workers). Backend: **Lovable Cloud enabled 2026-11-18** (database + login).
  NOTE: spec recommends Next.js + Prisma — NOT possible here; equivalent functionality will be
  built on the fixed stack. (Informed user 2026-11-18.)

## 2. What has already been built (as of 2026-11-18, Phase 1–4 partial)
- **Design:** palm-leaf/temple palette (parchment, kumkum red, turmeric gold, ink), Noto Serif/Sans
  Telugu + Spectral/Instrument Sans fonts, light + dark theme (Settings page). SVG-only visuals.
- **Languages:** Telugu (default) + English, switch in header/Settings (`src/lib/i18n.tsx`).
  Hindi/Tamil/Kannada/Malayalam NOT yet added.
- **Pages:** `/` welcome page, `/auth` (email+password, Google, Lovable sign-in, forgot password),
  `/reset-password`, and signed-in pages `/dashboard`, `/profiles`, `/chart`, `/chart/<id>`, `/settings`.
- **Database (Lovable Cloud):** `profiles` (display name, language, default ayanamsha/node/house
  system/chart style), `user_roles` (admin/astrologer/user, auto "user" on signup, `has_role()`),
  `birth_profiles` (name, gender, relation, date, time, time-known flag, place, lat/lon, IANA tz,
  UTC offset at birth, notes). Each user sees only their own rows.
- **Birth profiles:** add / edit / duplicate / delete / import + export JSON; place search
  (Open-Meteo geocoding, free, no key) fills lat/lon/time zone; historical UTC offset auto-computed.
- **Astronomical engine:** Swiss Ephemeris 2.10.03 WASM (`@swisseph/browser`, built-in Moshier
  ephemeris; optional Swiss data files supported in code but not yet exposed in UI). Sun–Pluto,
  true/mean Rahu, Ketu, Lagna, MC, house cusps; speed, latitude, declination.
  Ayanamshas: Lahiri, True Chitra, KP (Krishnamurti), Raman, Fagan-Bradley, Yukteshwar, True Pushya,
  J.N. Bhasin, Surya Siddhanta, Tropical. House systems: whole sign, equal, Placidus, Sripati (Porphyry).
- **Parashari (partial):** rashi, degree, nakshatra, pada, star lord, whole-sign house, dignity
  (exalted/debilitated/moolatrikona/own + compound Panchadha relation), combustion (retro-aware orbs),
  retrograde, house lordship, Graha Drishti (+ selectable Rahu/Ketu aspect convention), house table
  with occupants/aspects/Kendra-Trikona-Dusthana-Upachaya, conjunctions, Parivartana.
- **Charts:** South Indian + North Indian SVG (click a sign for details, degree toggle, outer planets toggle).
  Calculation details panel (engine version, ephemeris, ayanamsha value, UTC, JD, algorithm version).
  Unknown birth time → uses 12:00 and shows uncertainty warning; houses hidden.
- **Dashboard:** saved profiles + live "planets right now" panel.
- **Tests (28 passing):** `src/lib/astro/*.test.ts` — sign/nakshatra boundaries, dignities, combustion,
  aspects, historical time zones (India 1943 +06:30, US DST, leap day), Swiss Ephemeris checks
  (Lahiri at J2000 = 23.857°, Sun J2000, sidereal = tropical − ayanamsha, Ketu opposite Rahu).
- **Divisional charts (2026-11-18, v2 turn):** `src/lib/astro/varga.ts` — D1, D2, D3, D4, D5, D6, D7, D8, D9,
  D10, D11, D12, D16, D20, D24, D27, D30, D40, D45, D60, each with its own traditional rule (BPHS for the
  Shodashavarga; D5/D6/D8/D11 marked "later convention"). Chart page has a D1–D60 picker, shows the
  method/source per varga, varga degrees, Navamsha column + Vargottama badge in the planet table.
- **Vimshottari Dasha:** `src/lib/astro/dasha.ts` — birth balance from Moon's exact nakshatra position,
  Mahadasha → Antardasha → Pratyantardasha → Sookshma → Prana, running periods today, expandable tree,
  dasha-year setting (365.25 / 365.2422 / 360 days). Dates shown in the birth place's time zone.
- **More Parashari rules:** `src/lib/astro/bhava.ts` — natural benefic/malefic (waxing Moon, Mercury by
  association), functional nature per Lagna incl. Yogakaraka (BPHS ch. 34 summarised rule set v1),
  dispositor chains + final dispositor, Maraka lords, Badhaka, all 12 Arudha Padas (AL, UL).
- Algorithm version bumped to `astro-core-1.1.0`. **Tests: 65 passing** (6 files).
- Full spec saved in repo: `docs/specs/vedic-astrology-master-spec.md` (v1) and
  `docs/specs/astrojyotish-pro-master-spec-v2.md` (v2, latest).
- Phase roadmap: `roadmap.md`. Technical rules: `AGENTS.md`.

## 3. Requested changes / feature scope (summary of spec — see spec file for full lists)
| § | Module | Key points |
|---|--------|-----------|
| 2.1 | Parashari engine | D1, Lagna, dignity, aspects, combustion, retro, Parivartana, Arudha, Argala, Bhava Chalit, 25+ named yogas/doshas with formation + cancellation rules |
| 2.2 | Divisional charts | D1–D60 (D2,3,4,5,6,7,8,9,10,11,12,16,20,24,27,30,40,45,60) with authentic varga rules, not generic multiplication |
| 2.3 | Dashas | Vimshottari to Prana level + Yogini, Chara, Narayana, Kalachakra, Ashtottari, Shodashottari, Dwisaptati, Panchottari |
| 2.4 | Jaimini | 7/8 Chara Karakas, Karakamsha, Arudha Padas, Upapada, Rashi Drishti, Chara Dasha |
| 2.5 | KP | KP old/new ayanamsha, Placidus, sub/sub-sub lords, significators, ruling planets, horary 1–249 |
| 2.6 | Other | Nadi, BNN, Tajika/Varshaphala, Sahams, Sarvatobhadra, Prashna, rectification, medical (as tradition, not diagnosis) |
| 3 | Ephemeris | Swiss Ephemeris or licensed equivalent; sidereal/tropical, topocentric, true/mean node, house systems, ayanamsha library (Lahiri, KP, Raman, Fagan-Bradley, Yukteshwar, etc.) |
| 4–5 | Panchanga, Ashtakavarga, Shadbala | Full Panchanga engine; strength calculations |
| 6 | Numerology | Vedic, Chaldean, Pythagorean + additional |
| 7 | Western astrology | Tropical wheel etc. |
| 8–13 | Predictions, Transits, Rectification, Matchmaking, Prashna, Muhurta | Ranked muhurta windows with reasoning |
| 14 | Gemini AI Astrologer (CORE) | User-provided Gemini key, settings page (masked key, test, model registry, usage, logs), key server-side encrypted only; chat with saved chart, history, voice, TTS, PDF export |
| 15 | Knowledge library | Vedas, Upanishads, BPHS, Brihat Jataka… searchable; no fabricated quotes |
| 16 | Chart visuals | South/North/East Indian, Western wheel, KP chart; interactive; PNG/PDF export; Telugu labels |
| 17 | Users & profiles | Register/login/reset, multiple + family birth profiles, import/export |
| 18 | Reports | ~19 report types, Telugu + English PDFs with embedded Telugu fonts |
| 19–20 | Comparison dashboard; 25-item navigation | Every nav item must be a working module |
| 21 | UX | Premium, traditional Indian identity, mobile-first, dark + light mode, global search |
| 22 | Multilingual | Localization framework, switch language without data loss |
| 23–26 | Architecture, DB, Security, Performance | Modular independently-testable engines; store calc metadata (ephemeris version, ayanamsha, house system, tz, algorithm version) |
| 27 | Testing | Mandatory automated tests for all calculations + edge cases (midnight, sign boundary, DST, polar, missing time) |
| 28–29 | Admin panel; Subscriptions | Subscriptions optional, payments not required during development |
| 30 | Deliverables | .env.example, API docs, schema, install/deploy docs, Gemini + ephemeris licensing docs |

## 3b. Spec v2 (received 2026-11-18, `docs/specs/astrojyotish-pro-master-spec-v2.md`) — latest source of truth
Same scope as v1, reorganised into 28 parts. New or changed points vs v1:
- Product name in v2: **"AstroJyotish Pro"** (app currently named "Jyotisha Darpanam") — **asked user which to use; not changed yet.**
- Languages: Telugu, English, **Hindi**, Sanskrit terminology (v1 also listed Tamil/Kannada/Malayalam).
- Profiles: add country/state/city, birth-time accuracy, DST info, archive, favorite, search, compare,
  profile history, optional profile image; relations incl. relatives/custom. Account deletion.
- Settings saved with every calculation; changing a setting must recalculate (already the case).
- Ayanamsha manager: show value, epoch/method, source, compatibility; KP New; user-defined custom offset.
- Ephemeris extras: topocentric, stationary periods, sunrise/sunset/moonrise/moonset, transits.
- Calculation record: input data, UTC, coords, versions, timestamp, **result hash**.
- Parashari: Bhava Chalit, Bhava Madhya, Bhavat Bhavam, Maraka, Badhaka; yoga rule engine with
  formula/exceptions/cancellation/source per rule, configurable per tradition.
- Varga: dedicated analysis pages per varga, varga strength, D1–D9 / D1–D10 comparison.
- Dashas: Yogini, Chara, Narayana, Kalachakra, Ashtottari, Shodashottari, Panchottari, Dwisaptati Sama,
  only when eligibility conditions are met; dasha comparison; timeline visualisation.
- Panchanga adds Brahma Muhurta, Amrita Kalam, Choghadiya, Hora, Samvatsara; regional calendars
  (Telugu/Tamil/Kannada/Malayalam/North, Amanta/Purnimanta) and festival calendar.
- Numerology tools list (baby/business/brand/mobile/vehicle/house numbers, Lo Shu grid, karmic debt...).
- Western: progressions, solar/lunar return, synastry, composite.
- Life analysis: 30 topics with positive/negative evidence and confidence; never guaranteed predictions.
- AI: provider abstraction, admin + user Gemini key, model selection/capability detection, logs,
  rate limits, token/cost tracking; 15 response standards; personas; voice, TTS, history search, PDF export.
- Knowledge library record fields (Sanskrit, transliteration, Telugu/English translation, edition, reliability).
- 25-item main navigation (Part 22); desktop-first professional workspace with mobile compatibility.
- Required docs (Part 26): README, SYSTEM_ARCHITECTURE, MODULE_SPECIFICATIONS, DATABASE_SCHEMA,
  ASTROLOGY_CALCULATION_METHODS, AYANAMSHA_REFERENCE, VARGA_CALCULATION_RULES, DASHA_CALCULATION_RULES,
  KP_CALCULATION_RULES, NUMEROLOGY_METHODS, GEMINI_INTEGRATION, API_DOCUMENTATION, TESTING_GUIDE,
  SECURITY_GUIDE, DEPLOYMENT_GUIDE, BACKUP_AND_RECOVERY, THIRD_PARTY_LICENSES, .env.example.
- Part 27: work autonomously, keep a continuation manifest (= `roadmap.md` + this file), run tests per subsystem.
- v2 again recommends Next.js/Prisma/Redis/Docker — not possible on this platform (same as v1 note).

## 4. Errors & bugs to fix
- 2026-11-18: User reported `src/hooks/use-mobile.tsx(4,35): error TS2686: .` — **Investigated:
  not a real error.** Line 4 of that file is blank, the message text is empty, and a full
  TypeScript check of the project passes with zero errors. No code change made.
- 2026-11-18 (again, with spec v2 upload): same empty TS2686 message. Re-checked: line 4 blank,
  typecheck still clean. Not a real error; the message accompanies spec uploads.

## 5. Task status
| Task | Status | Notes |
|------|--------|-------|
| Create and maintain `chat.md` | Done | 2026-11-18 |
| Read spec file and record it here | Done | 2026-11-18 (same file re-uploaded later — identical) |
| Investigate use-mobile.tsx error | Done | No real error; typecheck clean |
| Clarify open decisions with user | Done | Answers in §6 |
| Phase 1 Foundation | Done | |
| Phase 2 Database & login | Done | Sign-up/sign-in flow not tested end-to-end (needs a real email confirmation) |
| Phase 3 Astronomical engine | Done | Moshier ephemeris in use; Swiss data files option not in UI yet |
| Read spec v2 and record it | Done | 2026-11-18, §3b |
| Phase 4 Core Parashari | In progress | Done now also: natural/functional nature, dispositors, Maraka, Badhaka, Arudha Padas. Left: Bhava Chalit, Argala, yoga/dosha rule engine |
| Phase 5 Divisional charts | In progress | All 20 vargas + Vargottama done & tested. Left: varga analysis pages, strength, comparisons |
| Phase 6 Dashas | In progress | Vimshottari to Prana done & tested. Left: other dasha systems, timeline chart |
| Phases 7–20 | Pending | Follow spec order |

## 6. Decisions (answered by user 2026-11-18)
1. **Ephemeris: Swiss Ephemeris** (chosen). NOTE: Swiss Ephemeris is AGPL — publishing a closed-source
   app needs a paid Astrodienst commercial license, otherwise source must be AGPL-compatible.
   Using `@swisseph/browser` (AGPL-3.0). Must be documented in deployment docs (phase 20).
2. **AI: Both** — built-in Lovable AI (Gemini models, no key) by default + optional user-provided
   Gemini API key stored server-side encrypted (phase 15).
3. **Build approach: follow spec §32 order fully**, phase by phase, without stopping for approval
   on routine decisions.
4. **Default language: Telugu.**
5. Fixed platform stack = TanStack Start + Lovable Cloud instead of the spec's Next.js/Prisma.
6. Login methods: email + password, Google, Lovable (platform default; user did not specify).

## Next steps
1. Finish Phase 4: Bhava Chalit, Argala/Virodhargala, yoga & dosha rule engine (formation, exceptions,
   cancellation, source) — Raja/Dhana/knowledge yogas, Manglik, Kala Sarpa, Kemadruma, etc.
2. Phase 5 rest: varga strength (Vimshopaka), D1–D9/D1–D10 comparison.
3. Phase 6 rest: Yogini, Ashtottari (with eligibility), Chara/Narayana, etc.; dasha timeline graphic.
4. Save calculated charts/metadata (+ result hash) to database when reports/AI need them.
5. Waiting on user: product name (AstroJyotish Pro vs Jyotisha Darpanam).

## 7. Must NOT be changed / removed / implemented
- Never rewrite the whole project when only a small change is needed.
- Never remove existing functionality without explicit user permission or requirement.
- **No AI-generated images** — pure code, Tailwind, SVG / Lucide icons only (spec preamble).
- No dummy buttons, fake planetary positions, simulated dashas, hardcoded charts, placeholder
  reports, fabricated AI predictions, or fake scripture quotes (spec §31).
- No API keys in frontend code; Gemini key server-side and encrypted only.
- AI must never do astronomical math; deterministic engines do calculations.
- Never mix KP and Parashari rules without labeling the system; expose competing conventions as settings.
- Never claim a module complete until it passes functional tests.
- Never claim 100% astronomical accuracy without verification.

## 8. Working rules (from user, 2026-11-18)
1. Read and understand every relevant file the user provides before any project task; consider them together.
2. Do not rely on file names to infer content — read each file. Names/extensions vary.
3. The latest applicable instruction is the primary source of truth; ask when missing, unclear, or contradictory.
4. Before code changes: read `chat.md` + relevant files, understand existing implementation, identify
   exact files to change, check restrictions, make only necessary changes, verify where possible.
5. Fix reported issues without breaking working functionality.
6. Keep `chat.md` organized, accurate, and detailed enough for a new session to continue without re-explanation.
7. After each task, report: what changed, errors fixed, files modified, what remains, and whether `chat.md` was updated.
8. If a task or fix can't be completed/verified, say so clearly — never claim success without checking.
9. Spec §32: maintain a development checklist; at completion give a feature-by-feature report
   (implemented, tested, external deps, config, limitations, deployment status).

## 9. Reference files index
| File | Purpose | Received |
|------|---------|----------|
| `docs/specs/vedic-astrology-master-spec.md` (uploaded as `file`) | Master feature spec v1 (32 sections, ~1450 lines) | 2026-11-18 |
| `docs/specs/astrojyotish-pro-master-spec-v2.md` (uploaded as `file-2`) | Master spec v2 "AstroJyotish Pro" (28 parts, ~1700 lines). Latest; summary of differences in §3b | 2026-11-18 |

## 9b. Known limitations (honest status)
- "KP New" ayanamsha is not built into Swiss Ephemeris — not offered yet.
- Rahu/Ketu dignity left unclassified (schools disagree) — needs a convention setting.
- Sripati house option currently shows Porphyry cusps (bhava madhya); Sripati sandhis not shown.
- East Indian chart, PNG/PDF export, Hindi/Tamil/Kannada/Malayalam not done yet.
- Place search depends on the free Open-Meteo service; lat/lon can be typed manually.
- D5, D6, D8, D11 use widely used later conventions (not in BPHS Shodashavarga); other D11 methods exist
  and are not yet selectable.
- Functional nature uses a summarised BPHS ch. 34 rule set; finer rules (e.g. Kendradhipati dosha
  strength, 8th-lord exceptions for Sun/Moon) not yet modelled. Rahu/Ketu functional nature not classified.
- Dasha dates not yet cross-checked against another software's golden dataset.

## 10. Decision & change history
- 2026-11-18 — `chat.md` created as the central project memory file per user instruction.
- 2026-11-18 — Master spec received and saved; reported TS2686 error investigated (not reproducible, no change).
- 2026-11-18 — User answered decisions (Swiss Ephemeris, AI both, spec order, Telugu default).
  Lovable Cloud enabled; Phases 1–3 built, Phase 4 partly built; 28 tests passing.
- 2026-11-18 — Spec v2 received (file-2) and saved; empty TS2686 re-checked (no error). Built all 20
  vargas, Vimshottari to Prana, natural/functional nature, dispositors, Maraka, Badhaka, Arudha Padas;
  65 tests passing; verified on the chart page in the preview.
