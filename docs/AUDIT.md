# Project audit & implementation inventory (spec v3 §1, Phase 1)

_Audit date: 2026-11-18. Covers (A) this app and (B) the uploaded standalone HTML tool
"విశ్వ జ్యోతిష్య మహా పీఠం" (`docs/reference/vishwa-jyotishya-maha-peetham.html`, received as `file-4`)._

Status legend: **V** implemented & verified by tests · **P** partial · **M** missing · **C** needs correction ·
**U** technically unsupported on this platform.

## 1. Source inspection — this app (A)
- Stack: TanStack Start v1 (React 19, Vite 7), Tailwind v4, Cloudflare Worker runtime, Lovable Cloud (Postgres + auth).
- Routes: `/`, `/auth`, `/reset-password`, signed-in `/dashboard`, `/profiles`, `/chart`, `/chart/$profileId`, `/settings`.
- Database: `profiles`, `user_roles` (+ `has_role`), `birth_profiles`; per-user row security.
- Engine: `src/lib/astro/` — `ephemeris.ts` (Swiss Ephemeris 2.10.03 WASM), `parashari.ts`, `varga.ts`,
  `dasha.ts`, `bhava.ts`, `time.ts`, `settings.ts`. Tests: 6 files, 65 tests.
- Not present yet: AI, PDF, search, admin UI, knowledge content, Hindi.

## 2. Source inspection — uploaded HTML tool (B)
- Single 4.4 MB offline HTML file, Telugu UI, data in browser localStorage, JSON/CSV/SVG export, print-to-PDF.
- Own JS engine with embedded tables (≈1 MB) + offline city list (≈1.2 MB, *current* UTC offsets only).
- Settings: Lahiri/KP and many ayanamsha names, **mean node only, Placidus only**, manual UTC offset
  (no historical DST/LMT — the tool says so itself).
- 21 section groups: birth-time rectification, Panchanga (+Choghadiya, Rahu/Yama/Gulika), planets/Avasthas/
  "energies" (colours, shapes), Parashari drishti, charts + interactive chart studio, Graha Maitri (natural/
  temporary/Panchadha), Shodasha Varga, Dashas (Vimshottari, Yogini, Jaimini Chara variant), Ashtakavarga
  (BAV/SAV), Gochara (ingress dates, Sade Sati/Ashtama lifetime list, Guru+Shani double transit),
  KP (cusps, sub-lords, significators, KP horary chart), analysis (Jaimini 7 Chara Karakas, Arudha A1–A12,
  yogas & doshas), insight/birth summary, Varshaphala, Prashna, Ashtakoota 36 + Dashakoota, Muhurta
  (Tarabala/Chandrabala), numerology & yantras, remedies, gemstone guide, Japa 108, status/progress.
- Extras: partial Shadbala, Bhava Bala, Vimshopaka, Pushkara Navamsha / Mrityu Bhaga / Gandanta, Upagrahas
  (Gulika/Mandi), approximate moonrise, alternative house views, daily/weekly horoscope, Kuja Dosha,
  naming letters, Rudraksha, Lal Kitab, Vastu, Sudarshana Chakra, 90-day Vrata calendar, two-chart comparison,
  "Report Studio" (multi-section Telugu report, print to PDF).
- Its own "not yet validated" list: Kalachakra, KP 1–249 horary, true node, moonrise/set, full Muhurta,
  Dashakoota tables, embedded-font PDF, multilingual UI, independent verification.

## 3. Accuracy cross-check (B's engine vs A's Swiss Ephemeris), Lahiri, mean node, Placidus
| UTC | Max planet difference | Lagna difference |
|---|---|---|
| 1900-06-15 06:00, Hyderabad | 0.00′ | 0.03′ |
| 1947-08-14 18:30, Delhi | 0.01′ | 0.07′ |
| 1994-02-20 08:00, Hyderabad | 0.04′ (Mercury) | 0.07′ |
| 2026-11-18 06:00, Chennai | 0.03′ (Venus) | 0.06′ |
| 2060-01-01 00:00, London | 0.01′ | 0.04′ |

Divisional signs D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60: **0 mismatches**
in 200,000 longitudes each. Vimshottari years and 365.25-day year: identical.
Conclusion: B's positions agree with Swiss Ephemeris to < 5″; this is consistency, **not** independent
verification (B appears to be built from Swiss-derived tables). A keeps Swiss Ephemeris (more settings:
true node, all house systems, historical time zones). A golden dataset from an independent source (e.g. JHora,
published charts) is still needed (spec v3 §36.4).

## 4. Implementation inventory
| Feature | A (this app) | B (HTML tool) | Action / correction | Status in A |
|---|---|---|---|---|
| Accounts, roles, private profiles | yes | no (local only) | keep A | V (sign-up flow not tested end-to-end) |
| Birth profile CRUD, import/export | yes (+ CSV, archive, favourite, search) | local JSON/CSV | — | V |
| Historical time zones/DST | yes (IANA) | no | keep A | V |
| Offline city list | online geocoder | 1.2 MB offline list | consider fallback | P |
| Ayanamsha registry | 10 | many names | add KP New only with documented definition; custom offset | P |
| True/mean node | both | mean | keep A | V |
| House systems | whole, equal, Placidus, Sripati(Porphyry) | Placidus | add Bhava Chalit, Sripati sandhis | P |
| Planet table (dignity, combust, retro, speed, decl.) | yes | yes | add tropical column, stationary status | P |
| Graha Maitri (natural/temporary/compound) | in dignity calc | full tables | add matrix view | P |
| Drishti, conjunction, Parivartana | yes | yes | add Rashi drishti, planetary war | P |
| Natural/functional nature, Yogakaraka, Maraka, Badhaka, dispositors, Arudha A1–A12 | yes | Arudha yes | — | V |
| Divisional charts D1–D60 (20) | yes | 16 | add varga comparison, Vimshopaka | P |
| Vimshottari to Prana | yes | yes | add timeline graphic, comparison | V |
| Yogini / Ashtottari / Chara / Narayana / Kalachakra | Yogini (MD+AD, `yogini.ts`) | Yogini, Chara variant | add Ashtottari, Chara, Narayana, Kalachakra | P |
| Avasthas, Pushkara, Mrityu Bhaga, Gandanta | no | yes | port with source labels | M |
| Shadbala, Bhava Bala, Ishta/Kashta | no | partial | implement full BPHS | M |
| Ashtakavarga (BAV/SAV, Shodhana, Pinda) | BAV, SAV, Trikona Shodhana (`ashtakavarga.ts`) | BAV/SAV | add Ekadhipatya Shodhana, Shodhya Pinda | P |
| Yoga & Dosha rule engine | 23 rules with 6 statuses, factors and source (`yogas.ts`): Mahapurusha ×5, Gajakesari, Budhaditya, Chandra-Mangala, Sunapha/Anapha/Durudhura, Kemadruma (+bhanga), Adhi, Raja, Dhana, Viparita ×3, Neecha Bhanga, Kuja (2nd-house setting), Kala Sarpa, Grahana, Guru-Chandala | basic list | add Nabhasa, Parivartana yogas, Dhana by D2/D11, more cancellation rules | P |
| Gochara, Sade Sati, ingress, double transit | transit table (from Moon/Lagna, any date), lifetime Saturn phases (Sade Sati, 4th, 8th) (`gochara.ts`); Saturn ingresses checked vs 2023/2025 dates | yes | add Jupiter+Saturn double transit, Vedha, ingress lists for all grahas | P |
| Jaimini (Karakas 7/8, Karakamsha, Argala, Chara/Narayana) | 7/8 Karakas (setting), Karakamsha, Rashi drishti, Argala on Lagna, Arudha (`jaimini.ts`) | 7 Karakas, Chara | add Chara/Narayana dasha, Jaimini yogas, Argala per house | P |
| KP (cusps, sub/sub-sub, significators, RP, horary 1–249) | no | most except 1–249 | implement | M |
| Panchanga, Choghadiya, Rahu/Yama/Gulika, sunrise | yes — `/panchanga`, `panchanga.ts`, sunrise rule is a setting; tested on Ugadi 2024 | yes | add moonrise/moonset, Hindu month/samvatsara, Dur muhurta, Varjyam | P |
| Muhurta, Prashna, Varshaphala, rectification | no | basic | implement | M |
| Matching (Ashtakoota, Dashakoota, Kuja) | no | yes | implement | M |
| Numerology (Vedic/Chaldean/Pythagorean/Lo Shu) | no | basic + yantras | implement | M |
| Western module | no | no | implement | M |
| Remedies, gemstones, Rudraksha, Japa, Lal Kitab, Vastu, Vrata calendar | no | yes | port as clearly-labelled traditional content | M |
| AI astrologer (Gemini) | no | no | Phase 11 | M |
| Reports / PDF | no | print-to-PDF studio | Phase 11 | M |
| Encyclopedia / Sanatana library | no | short tables | Phase 12 | M |
| Hindi UI | no | no | add language | M |
| Global search, breadcrumbs, 40-item navigation, recent charts | yes (unbuilt sections shown as "Soon", not linked) | section search | add favourite modules, recently viewed topics when topic pages exist | P |
| Admin area | roles only | no | Phase 13 | M |

## 5. Unsupported / changed by platform
- Next.js/Prisma/Redis/Docker (all specs) → TanStack Start + Lovable Cloud (same capabilities).
- Swiss Ephemeris is AGPL-3.0: closed-source publishing needs an Astrodienst commercial licence.

## 6. Preservation
No existing user data, settings or calculations were changed by this audit. Existing saved profile
(1, Kurnool) and its settings (KP ayanamsha default) remain intact.
