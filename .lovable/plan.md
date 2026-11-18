# AstroJyotish Pro — what is still missing

Note: the TS2686 line is not a real error. The TypeScript check passes with zero errors, so this plan covers only the missing features.

## Already done
- Sign-in (email, Google, Lovable), private birth profiles, import/export, historical time zones
- Swiss Ephemeris engine: 10 ayanamshas, true/mean node, 4 house systems
- Planet table, dignity, combustion, retrograde, aspects, conjunctions, exchanges
- Planet nature, Yogakaraka, Maraka, Badhaka, dispositors, Arudha Padas A1–A12
- All 20 divisional charts (D1–D60), Vargottama
- Vimshottari Dasha down to Prana level
- South and North Indian charts, Telugu/English UI, unknown birth time warnings

## Missing — in build order (spec v3)

### Stage 1 — Navigation (spec v3 Phase 2)
- Sidebar with all 40 sections, breadcrumbs, global search, recent and favourite profiles
- Profile list: search, archive, favourite, CSV import/export

### Stage 2 — Finish the core chart engine
- Bhava Chalit, Sripati house edges, Argala, sign (Rashi) aspects, planetary war
- Graha Maitri friendship table view, stationary status, tropical column
- Avasthas, Pushkara Navamsha, Mrityu Bhaga, Gandanta
- Varga comparison table and Vimshopaka strength

### Stage 3 — More dashas
- Yogini, Ashtottari, Chara, Narayana, Kalachakra (each shows when it applies)
- Dasha timeline graphic

### Stage 4 — KP and Jaimini
- KP: cusps, sub and sub-sub lords, significators, ruling planets, horary 1–249
- Jaimini: 7/8 Chara Karakas, Karakamsha, Argala, Chara/Narayana dasha

### Stage 5 — Panchanga
- Tithi, Vara, Nakshatra, Yoga, Karana, sunrise/sunset, moonrise
- Rahu Kalam, Yamagandam, Gulika, Choghadiya, Hora

### Stage 6 — Strength and yogas
- Ashtakavarga (BAV/SAV, Shodhana, Pinda)
- Full Shadbala, Bhava Bala, Ishta/Kashta
- Yoga and Dosha rule engine with six results: confirmed, weakened, cancelled, conditional, not formed, insufficient data

### Stage 7 — Prediction
- Transits (Gochara), sign-entry dates, Sade Sati / Ashtama Shani, Jupiter+Saturn double transit
- Varshaphala (yearly chart), birth time rectification

### Stage 8 — Matching, Prashna, Muhurta
- Ashtakoota (36 points), Dashakoota, Kuja Dosha
- Prashna chart, Muhurta (Tarabala, Chandrabala)

### Stage 9 — Other systems
- Numerology (Vedic, Chaldean, Pythagorean, Lo Shu)
- Western astrology module
- Remedies, gemstones, Rudraksha, Japa, Lal Kitab, Vastu, Vrata calendar — marked as traditional content

### Stage 10 — AI, reports, library
- AI astrologer: built-in AI plus optional personal Gemini key. AI only explains calculated results.
- Telugu/English PDF reports, chart PNG/PDF export, East Indian chart, Western wheel
- Knowledge library / encyclopedia pages, Hindi language

### Stage 11 — Admin and release
- Admin area, subscriptions
- Checks against an independent reference dataset (e.g. JHora)
- Setup docs and ephemeris licence note

## Open question for you
- Should features from your earlier HTML tool be brought into this app? This plan assumes yes, keeping this app's calculations.

## Technical notes
- Each new system gets its own module and test file in `src/lib/astro/`, using `RawChart` only.
- Points where schools disagree become settings, never silent defaults.
- `docs/AUDIT.md`, `roadmap.md`, and `chat.md` are updated as each stage lands.
