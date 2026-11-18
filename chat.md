# chat.md — Central Project Memory

> Read this file first at the start of every session or task. Keep it updated whenever new
> project information, files, or instructions arrive. Never delete useful history; when a
> requirement changes, update it and note what it replaced. Do not record assumptions as facts.

_Last updated: 2026-11-18 06:10 UTC_

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
- Full spec saved in repo: `docs/specs/vedic-astrology-master-spec.md`.
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

## 4. Errors & bugs to fix
- 2026-11-18: User reported `src/hooks/use-mobile.tsx(4,35): error TS2686: .` — **Investigated:
  not a real error.** Line 4 of that file is blank, the message text is empty, and a full
  TypeScript check of the project passes with zero errors. No code change made.

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
| Phase 4 Core Parashari | In progress | See roadmap.md for remaining items |
| Phases 5–20 | Pending | Follow spec §32 order |

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
1. Finish Phase 4: functional benefics/malefics, dispositor chains, Bhava Chalit, Arudha Lagna,
   Argala, Maraka/Badhaka, yoga & dosha detection with formation/cancellation rules.
2. Phase 5: authentic divisional chart (varga) rules D2–D60.
3. Phase 6: Vimshottari dasha (MD→Prana), then other dashas.
4. Save calculated charts/metadata to database when reports/AI need them.

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
| `docs/specs/vedic-astrology-master-spec.md` (uploaded as `file`) | Master feature spec for the whole astrology platform (32 sections, ~1450 lines) | 2026-11-18 |

## 9b. Known limitations (honest status)
- "KP New" ayanamsha is not built into Swiss Ephemeris — not offered yet.
- Rahu/Ketu dignity left unclassified (schools disagree) — needs a convention setting.
- Sripati house option currently shows Porphyry cusps (bhava madhya); Sripati sandhis not shown.
- East Indian chart, PNG/PDF export, Hindi/Tamil/Kannada/Malayalam not done yet.
- Place search depends on the free Open-Meteo service; lat/lon can be typed manually.

## 10. Decision & change history
- 2026-11-18 — `chat.md` created as the central project memory file per user instruction.
- 2026-11-18 — Master spec received and saved; reported TS2686 error investigated (not reproducible, no change).
- 2026-11-18 — User answered decisions (Swiss Ephemeris, AI both, spec order, Telugu default).
  Lovable Cloud enabled; Phases 1–3 built, Phase 4 partly built; 28 tests passing.
