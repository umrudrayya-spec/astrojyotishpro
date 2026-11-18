# chat.md — Central Project Memory

> Read this file first at the start of every session or task. Keep it updated whenever new
> project information, files, or instructions arrive. Never delete useful history; when a
> requirement changes, update it and note what it replaced. Do not record assumptions as facts.

_Last updated: 2026-11-18 05:45 UTC_

---

## 1. Project purpose & overview
- **Product (from spec file, 2026-11-18):** A complete, production-ready Vedic Astrology (Jyotish),
  KP, Jaimini, Numerology, Panchanga, Western Astrology and **Gemini AI Astrologer** platform.
- Must be a real product, not a demo/prototype. All values come from real astronomical
  calculations; AI only *interprets* calculated data, never invents positions.
- Primary languages: **Telugu + English** (reports, chart labels). Also Hindi, Tamil, Kannada,
  Malayalam, Sanskrit terminology.
- **Platform stack (fixed by environment):** TanStack Start v1 (React 19, Vite 7), Tailwind CSS v4,
  edge runtime (Cloudflare Workers). Backend would be Lovable Cloud (database + login).
  NOTE: spec recommends Next.js + Prisma — NOT possible here; equivalent functionality will be
  built on the fixed stack. (Informed user 2026-11-18.)

## 2. What has already been built
- Fresh template only. Home page (`/`) still shows the default placeholder.
- No custom pages, features, database, or login exist yet.
- Full spec saved in repo: `docs/specs/vedic-astrology-master-spec.md`.

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
| Read spec file and record it here | Done | 2026-11-18 |
| Investigate use-mobile.tsx error | Done | No real error; typecheck clean |
| Clarify open decisions (§6) with user | In progress | Asked 2026-11-18 |
| Build platform (spec §32 order) | Pending | Waiting for answers to open decisions |

## 6. Open decisions (need user answer — do NOT assume)
1. Ephemeris library: Swiss Ephemeris is AGPL (or paid commercial license) vs. an MIT-licensed
   pure-JS engine. Affects licensing and accuracy.
2. AI: user's own Gemini API key (as spec says) vs. built-in Lovable AI (includes Gemini models, no key).
3. Build approach: spec is very large — it must be delivered in phases across many sessions.
   Confirm starting phase (spec §32 order: foundation → database & login → astronomical engine → Parashari …).
4. Spec §32 says "don't ask for approval"; user's general rules say "ask when unclear". Current
   approach: ask only for major/contradictory decisions, decide routine ones independently.

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

## 10. Decision & change history
- 2026-11-18 — `chat.md` created as the central project memory file per user instruction.
- 2026-11-18 — Master spec received and saved; reported TS2686 error investigated (not reproducible, no change).
