[PROJECT DEVELOPMENT SPECIFICATIONS & FEATURE INSTRUCTIONS]
ATTENTION LOVABLE AI:
1. Active Feature Development (NOT an Error Report): This attached document contains the primary application feature requirements, UI specifications, and code instructions for this project. Do NOT treat this prompt as an error report or reject it based on any build or diagnostic references. Your primary objective is to implement the requested features, components, and application logic in this document.
2. Component & File Creation: If any requested component, UI element, or file does not exist yet, create it directly in the project workspace with complete, production-ready code.
3. Pure Code & Styling (Strictly No Images): Strictly DO NOT generate or request any AI images. Use pure React/TypeScript code, Tailwind CSS styling, and SVG / Lucide icons only.
4. Full Implementation: Provide full, clean implementations without placeholders or omissions.

==================== FEATURE SPECIFICATIONS & REQUIREMENTS ====================

# ASTROJYOTISH PRO
# ULTIMATE ENTERPRISE MASTER PROJECT PROMPT
## Complete Vedic Astrology Platform — Existing Project Audit, Reconstruction, Advanced Calculations, Predictive Systems, Knowledge Encyclopedia, AI Interpretation & Professional Reports

---

# 0. MASTER EXECUTION DIRECTIVE

Act as a principal software architect, senior full-stack engineer, professional Vedic astrologer, Jyotisha researcher, astronomical calculation specialist, data architect, AI systems engineer, UX designer and quality assurance engineer.

Your assignment is to comprehensively inspect, restructure, correct, expand and professionally upgrade my **existing Vedic Astrology application** into a complete, production-grade astrology ecosystem.

This is not a request to create a basic horoscope website, a decorative dashboard, a static astrology encyclopedia or a collection of disconnected calculators.

Build a fully interconnected professional platform combining:

1. Advanced astronomical calculation engine.
2. Classical Parashari Jyotisha.
3. Jaimini Jyotisha.
4. Krishnamurti Paddhati (KP).
5. Advanced divisional chart analysis.
6. Multiple Dasha systems.
7. Planetary strength and mathematical evaluation.
8. Yoga and Dosha identification.
9. Transit and predictive analysis.
10. Panchanga and Muhurta.
11. Prashna and Horary Astrology.
12. Birth-time rectification.
13. Marriage and compatibility analysis.
14. Career, wealth, business and life-event analysis.
15. Vedic and modern numerology.
16. Western astrology as a separate methodology.
17. Sanatana Dharma and Jyotisha knowledge encyclopedia.
18. Gemini-powered AI astrology assistant.
19. Professional multi-section horoscope reports.
20. Research, comparison, validation and learning tools.

**The central requirement is accuracy, completeness, consistency and real functionality.**

Do not simply add pages containing descriptions. Implement the underlying calculations, rules, data structures, interpretation logic, navigation, visualizations and interactions.

Every module must have a defined purpose, a functioning implementation, connected data and appropriate validation.

## Non-negotiable execution rules

- Work on the existing project and inspect its complete structure first.
- Preserve existing working functionality, calculations, settings, user data and valuable content.
- Improve existing modules rather than creating unnecessary duplicates.
- Never replace a working calculation with a simplified approximation.
- Never display fabricated planetary positions, Dasha dates, KP sub-lords or chart results.
- Never mark an unimplemented feature as complete.
- Never generate an interpretation without the required chart data.
- Never silently combine conflicting astrological methodologies.
- Never invent classical references or Sanskrit quotations.
- Do not leave placeholder pages, fake buttons or disconnected navigation.
- Do not stop after creating the dashboard, sidebar or design system.
- Continue through implementation, integration, testing and final verification.
- When a requirement cannot be implemented because a reliable method, source or dependency is unavailable, document the limitation instead of fabricating a result.

---

# 1. COMPLETE EXISTING PROJECT DISCOVERY AND AUDIT

Before changing any code, perform a comprehensive project audit.

## 1.1 Source-code inspection

Inspect:

- Complete project directory.
- Framework and runtime.
- Package manager and dependencies.
- Existing application entry points.
- Routing architecture.
- Page components.
- Shared components.
- Layout components.
- State management.
- API routes.
- Database schema.
- Existing JSON datasets.
- Static content files.
- Authentication and user management.
- Environment variables.
- Calculation libraries.
- Existing astrology algorithms.
- AI integration.
- PDF generation.
- Chart rendering.
- Search functionality.
- Localization.
- Build and deployment configuration.

## 1.2 Functional audit

Inspect each existing feature and classify it as:

- Fully implemented and verified.
- Implemented but requires correction.
- Partially implemented.
- Presentational only.
- Broken.
- Duplicated.
- Missing.
- Technically unsupported.

Audit the accuracy of:

- Birth details.
- Time-zone conversion.
- Ascendant calculation.
- Planetary longitude.
- Ayanamsha.
- House cusps.
- Nakshatra.
- Pada.
- Divisional charts.
- Dasha balance.
- Dasha date boundaries.
- Shadbala.
- Ashtakavarga.
- Yogas.
- Doshas.
- KP calculations.
- Jaimini calculations.
- Panchanga.
- Transit positions.
- Numerology.
- Report generation.

## 1.3 Create an implementation inventory

Maintain a project-wide checklist containing:

- Feature name.
- Existing implementation.
- Required correction.
- Dependencies.
- Calculation methodology.
- Implementation status.
- Test coverage.
- Outstanding issues.

Do not destroy or rewrite existing functionality before understanding its dependencies.

## 1.4 Existing project preservation

Before significant modifications:

- Preserve existing user records.
- Preserve saved charts.
- Preserve settings.
- Preserve existing content.
- Preserve working APIs.
- Preserve valid calculation results.
- Maintain compatibility with existing stored data.
- Create database migrations instead of destructive schema replacements.
- Provide rollback procedures for major structural changes.

---

# 2. NEW APPLICATION INFORMATION ARCHITECTURE

Reorganize the entire platform into a clear, professional hierarchy.

## 2.1 Primary navigation

Create these primary sections:

1. Dashboard
2. Birth Chart
3. Horoscope Analysis
4. Astrology Calculators
5. Grahas
6. Rashis
7. Bhavas
8. Nakshatras
9. Divisional Charts
10. Planetary Strength
11. Yogas
12. Doshas
13. Dasha Systems
14. Gochar and Transits
15. Ashtakavarga
16. Parashari Astrology
17. Jaimini Astrology
18. KP Astrology
19. Marriage Astrology
20. Career Astrology
21. Wealth Astrology
22. Health Indicators
23. Education and Children
24. Property and Foreign Settlement
25. Spiritual Astrology
26. Panchanga
27. Muhurta
28. Prashna
29. Birth Time Rectification
30. Compatibility
31. Numerology
32. Western Astrology
33. AI Astrologer
34. Horoscope Reports
35. Astrology Encyclopedia
36. Sanatana Dharma Library
37. Learning Centre
38. Research Laboratory
39. Reference Library
40. Settings and Administration

## 2.2 Navigation requirements

Implement:

- Expandable sidebar categories.
- Nested navigation.
- Global search.
- Search suggestions.
- Breadcrumbs.
- Recently viewed topics.
- Recently accessed charts.
- Favorite modules.
- Related-topic navigation.
- Contextual links between concepts.
- Mobile navigation drawer.
- Keyboard navigation.
- Deep linking to individual calculations and reports.

Avoid unnecessarily long pages and overcrowded dashboards.

Every page must have a meaningful purpose and a consistent structure.

---

# 3. CENTRAL ASTRONOMICAL CALCULATION ENGINE

This is the foundation of the entire application.

Create one authoritative calculation engine that supplies data to all astrology modules.

Do not implement separate, inconsistent planetary calculations inside individual pages.

## 3.1 Astronomical calculation architecture

Separate:

1. Date and time normalization.
2. Geographic location resolution.
3. Time-zone conversion.
4. Astronomical ephemeris.
5. Sidereal coordinate conversion.
6. Ayanamsha calculation.
7. Ascendant and house calculation.
8. Planetary position calculation.
9. Nakshatra calculation.
10. Divisional chart calculation.
11. Dasha calculation.
12. Derived astrological calculations.

Use a validated astronomical ephemeris such as Swiss Ephemeris or another suitable, documented engine.

Verify its licensing conditions before deployment.

Store:

- Ephemeris version.
- Calculation engine version.
- Ayanamsha.
- House system.
- Node method.
- Zodiac type.
- Time-zone database version where available.
- Calculation timestamp.
- Precision settings.
- Relevant calculation conventions.

## 3.2 Birth input system

Support:

- Full name.
- Gender as an optional profile field.
- Date of birth.
- Exact local birth time.
- Birth-time accuracy or uncertainty.
- Birth location.
- Latitude.
- Longitude.
- Elevation when available.
- Historical time zone.
- Daylight-saving adjustment.
- Source of birth-time information.
- Birth-time confidence.

Provide:

- City autocomplete.
- Country selection.
- Manual latitude and longitude.
- Manual time-zone override.
- Historical time-zone resolution.
- Unknown birth-time mode.
- Approximate birth-time mode.
- Birth-time uncertainty interval.

Do not silently assume 12:00 PM or another default time when the user has not supplied a reliable birth time.

If birth time is unknown, disable or qualify calculations that depend on the Ascendant and house cusps.

## 3.3 Calculation settings

Support independently configurable settings:

### Zodiac

- Sidereal.
- Tropical.

### Ayanamsha

- Lahiri/Chitrapaksha.
- Raman.
- KP.
- KP New, only with a documented definition and implementation.
- Yukteswar.
- Fagan-Bradley.
- True Chitrapaksha where supported.
- Other validated ayanamshas.

Provide an extensible ayanamsha registry.

Do not display 48 or any other number of ayanamshas merely as a marketing feature. Include only methods that have defined, documented and tested calculations.

### Nodes

- Mean Rahu and Ketu.
- True Rahu and Ketu.

### House systems

- Whole Sign.
- Equal House.
- Sripati.
- Bhava Chalit.
- Placidus.
- Other supported systems.

Do not treat Bhava Chalit and Rashi charts as interchangeable.

### Planetary bodies

- Sun.
- Moon.
- Mars.
- Mercury.
- Jupiter.
- Venus.
- Saturn.
- Rahu.
- Ketu.

Optional Western module:

- Uranus.
- Neptune.
- Pluto.
- Chiron and other supported bodies.

Clearly distinguish classical Navagraha interpretation from additional astronomical bodies.

## 3.4 Planetary calculation output

For every body, provide:

- Sidereal longitude.
- Tropical longitude.
- Sign.
- Exact degree.
- Minutes.
- Seconds.
- House.
- Nakshatra.
- Pada.
- Nakshatra lord.
- Sign lord.
- Retrograde status.
- Direct or stationary status where available.
- Combustion status.
- Speed.
- Latitude.
- Declination where relevant.
- Ayanamsha-adjusted longitude.
- Dignity.
- Relevant aspects.
- Relevant divisional placements.

Display exact numerical values with configurable precision.

## 3.5 Calculation reproducibility

The same birth information and calculation settings must reproduce the same result under the same calculation engine version.

Store calculation settings with each saved chart.

Allow users to duplicate a chart and change only one calculation setting to compare results.

---

# 4. COMPLETE PARASHARI JYOTISHA ENGINE

Build a complete Parashari calculation and interpretation subsystem.

## 4.1 Core concepts

Implement:

- Lagna.
- Chandra Lagna.
- Surya Lagna.
- Rashi.
- Bhava.
- Bhava Madhya.
- Bhava Sandhi.
- Bhava Chalit.
- House ownership.
- Planetary occupation.
- Planetary aspects.
- Rashi aspects where applicable.
- Natural benefic and malefic classification.
- Functional benefic and malefic classification.
- Yogakaraka.
- Maraka.
- Badhaka.
- Kendra.
- Trikona.
- Upachaya.
- Dusthana.
- Trishadaya.
- Bhavat Bhavam.
- House lord relationships.
- Dispositor chains.
- Parivartana.
- Planetary conjunctions.
- Planetary war.
- Combustion.
- Retrogression.

## 4.2 Graha drishti

Implement the classical aspects:

- All planets: seventh aspect.
- Mars: fourth and eighth special aspects.
- Jupiter: fifth and ninth special aspects.
- Saturn: third and tenth special aspects.
- Rahu and Ketu: configurable tradition-specific aspect rules.

Clearly identify the selected Rahu-Ketu aspect convention.

Do not silently mix traditions.

## 4.3 Planetary dignity

Calculate:

- Exaltation.
- Debilitation.
- Own sign.
- Moolatrikona.
- Great friend.
- Friend.
- Neutral.
- Enemy.
- Great enemy.
- Temporary friendship.
- Compound relationship.
- Directional strength.
- Vargic dignity.
- Vargottama.
- Pushkara placements where defined.

Provide the underlying rule and numerical or categorical basis.

## 4.4 Advanced planetary states

Include:

- Baladi Avastha.
- Jagradadi Avastha.
- Deeptadi Avastha.
- Lajjitadi Avastha.
- Shayana and other supported Avasthas.
- Combustion.
- Retrogression.
- Planetary war.
- Planetary speed.
- Planetary maturity.
- Sandhi and boundary conditions.

Each method must identify its source convention and formula.

---

# 5. COMPLETE NINE GRAHA ENCYCLOPEDIA

Create individual professional reference pages for:

- Surya.
- Chandra.
- Mangala.
- Budha.
- Guru.
- Shukra.
- Shani.
- Rahu.
- Ketu.

Each planet page must contain:

1. Sanskrit name.
2. Symbol.
3. Natural significations.
4. Karakatwas.
5. Element and Guna associations.
6. Gender and temperament classifications where applicable.
7. Rulership.
8. Exaltation.
9. Debilitation.
10. Moolatrikona.
11. Own signs.
12. Natural relationships.
13. Temporary relationships.
14. Functional relationships by Ascendant.
15. Special aspects.
16. Digbala.
17. Shadbala.
18. Avasthas.
19. Combustion.
20. Retrogression.
21. Planetary war.
22. Nakshatra rulership.
23. House-wise results.
24. Sign-wise results.
25. Conjunction results.
26. Aspect results.
27. Dasha results.
28. Transit results.
29. Divisional-chart significance.
30. Yoga participation.
31. Spiritual and philosophical significance.
32. Classical references.
33. Traditional remedies.
34. Practical chart examples.

Include interactive tables for sign placement, house placement, dignity and planetary relationships.

---

# 6. COMPLETE TWELVE RASHI KNOWLEDGE SYSTEM

Create detailed modules for all twelve signs.

For every Rashi include:

- Sanskrit name.
- Degree range.
- Rashi lord.
- Element.
- Modality.
- Gender classification.
- Odd/even classification.
- Movable, fixed or dual classification.
- Direction.
- Body-part association.
- Natural characteristics.
- Exaltation and debilitation associations.
- Planetary friendship.
- Sign compatibility.
- Nakshatra distribution.
- Pada distribution.
- House interpretation.
- Planetary placement interpretation.
- Dasha and transit significance.
- Classical references.

Include a Rashi comparison matrix.

---

# 7. COMPLETE TWELVE BHAVA SYSTEM

Create a separate detailed page for every house.

For each Bhava include:

- House number.
- Sanskrit terminology.
- Main significations.
- Secondary significations.
- Body-part associations.
- Life-domain associations.
- House lord.
- Occupying planets.
- Aspecting planets.
- Bhava strength.
- Bhava Madhya.
- Bhava Sandhi.
- House lord dignity.
- House lord placement.
- Dispositor.
- Relevant Karakas.
- Relevant divisional charts.
- Dasha activation.
- Transit activation.
- Classical interpretation rules.

Implement detailed analysis of:

1. First Bhava — Tanu.
2. Second Bhava — Dhana.
3. Third Bhava — Sahaja.
4. Fourth Bhava — Sukha.
5. Fifth Bhava — Putra.
6. Sixth Bhava — Ari.
7. Seventh Bhava — Yuvati.
8. Eighth Bhava — Randhra.
9. Ninth Bhava — Dharma.
10. Tenth Bhava — Karma.
11. Eleventh Bhava — Labha.
12. Twelfth Bhava — Vyaya.

Add:

- Kendra.
- Trikona.
- Upachaya.
- Dusthana.
- Maraka.
- Badhaka.
- Bhavat Bhavam.
- House strength comparison.
- House-lord relationship matrix.

---

# 8. COMPLETE 27 NAKSHATRA SYSTEM

Implement all 27 Nakshatras and 108 Padas.

For every Nakshatra include:

- Sanskrit name.
- Transliteration.
- Exact longitude interval.
- Four Pada ranges.
- Ruling planet.
- Deity.
- Symbol.
- Gana.
- Yoni.
- Nadi.
- Varna.
- Tatwa.
- Nadi and compatibility associations.
- Rashi distribution.
- Navamsha mapping.
- Primary characteristics.
- Strengths.
- Challenges.
- Motivation.
- Psychological themes.
- Career associations.
- Relationship themes.
- Spiritual significance.
- Nakshatra lord interpretation.
- Planetary placement results.
- Dasha implications.
- Compatibility rules.
- Classical references.

Include:

- Interactive Nakshatra wheel.
- Pada calculator.
- Nakshatra comparison.
- Planet-to-Nakshatra lookup.
- Birth Nakshatra calculator.
- Tara Bala.
- Chandra Bala.
- Nakshatra-based Muhurta support.

Ensure boundary calculations are mathematically exact.

---

# 9. COMPLETE SHODASHA VARGA AND D1–D60 SYSTEM

Implement the traditional Shodasha Varga system:

| Varga | Chart | Main area |
|---|---|---|
| D1 | Rashi | Overall horoscope |
| D2 | Hora | Wealth |
| D3 | Drekkana | Siblings and initiative |
| D4 | Chaturthamsha | Property and fortune |
| D7 | Saptamsha | Children |
| D9 | Navamsha | Dharma, marriage and planetary maturity |
| D10 | Dashamsha | Career and profession |
| D12 | Dwadashamsha | Parents and ancestry |
| D16 | Shodashamsha | Comforts and vehicles |
| D20 | Vimshamsha | Spiritual practice |
| D24 | Chaturvimshamsha | Education and learning |
| D27 | Saptavimshamsha | Strength and resilience |
| D30 | Trimshamsha | Difficulties and afflictions |
| D40 | Khavedamsha | Auspicious and inauspicious influences |
| D45 | Akshavedamsha | Character and conduct |
| D60 | Shashtiamsha | Fine karmic analysis |

Also support:

- D5.
- D6.
- D8.
- D11.
- Other divisional charts where a documented calculation method is available.

## 9.1 Divisional chart requirements

For each Varga implement:

- Classical calculation formula.
- Sign division.
- Planetary placement.
- Lagna calculation.
- House mapping.
- Planetary dignity.
- Varga lordship.
- Vargottama.
- Relevant special conditions.
- Birth-time sensitivity.
- Interpretive scope.
- Relevant source references.

Do not calculate all Vargas by applying a generic multiplication formula.

Use the correct traditional calculation rules for each division.

## 9.2 Varga analysis

Provide:

- Individual chart view.
- North Indian layout.
- South Indian layout.
- Planetary table.
- House table.
- Varga comparison.
- D1-to-D9 comparison.
- D1-to-D10 comparison.
- Varga dignity.
- Planetary strength across Vargas.
- Vargottama identification.
- Varga-based report generation.

Allow users to compare two Vargas side by side.

---

# 10. PLANETARY STRENGTH AND BALA CALCULATOR

Build a mathematical strength calculation laboratory.

## 10.1 Shadbala

Implement all six components:

1. Sthana Bala.
2. Dig Bala.
3. Kala Bala.
4. Cheshta Bala.
5. Naisargika Bala.
6. Drik Bala.

Where applicable, break down Sthana Bala into:

- Uccha Bala.
- Saptavargaja Bala.
- Ojayugmarasyamsa Bala.
- Kendradi Bala.
- Drekkana Bala.

Break down Kala Bala into supported traditional components, including:

- Nathonnatha Bala.
- Paksha Bala.
- Tribhaga Bala.
- Varsha Bala.
- Masa Bala.
- Vara Bala.
- Hora Bala.
- Ayana Bala.
- Yuddha-related components where applicable.

## 10.2 Additional strength calculations

Include:

- Ishta Phala.
- Kashta Phala.
- Vimsopaka Bala.
- Varga Bala.
- Bhava Bala.
- Ashtakavarga strength.
- Graha Yuddha.
- Planetary Avasthas.
- Digbala.
- Cheshta Bala.

## 10.3 Strength presentation

Display:

- Raw calculation.
- Formula.
- Units.
- Component-wise breakdown.
- Total.
- Reference minimum or expected strength where applicable.
- Comparative strength.
- Methodology.
- Interpretation.
- Calculation limitations.

Do not assign arbitrary scores or percentages and label them as classical Shadbala.

---

# 11. ASHTAKAVARGA ENGINE

Implement:

- Bhinnashtakavarga.
- Sarvashtakavarga.
- Rekha calculation.
- Bindu calculation.
- Planet-wise tables.
- Sign-wise strength.
- House-wise interpretation.
- Trikona Shodhana.
- Ekadhipatya Shodhana.
- Pinda calculations.
- Rashi Pinda.
- Graha Pinda.
- Shodhya Pinda.
- Transit interpretation.

Create interactive:

- Ashtakavarga charts.
- 12-sign tables.
- Planet comparison.
- Sarvashtakavarga heatmap.
- Transit-based Bindu analysis.

Every value must come from the actual calculation engine.

---

# 12. ADVANCED YOGA IDENTIFICATION ENGINE

Build a rule-based Yoga engine.

Do not identify yogas through simple keyword matching or basic planetary conjunction checks.

## 12.1 Yoga categories

### Raja Yogas

- Kendra-Trikona Raja Yoga.
- Dharma-Karmadhipati Yoga.
- Pancha Mahapurusha Yogas.
- Neechabhanga Raja Yoga.
- Vipareeta Raja Yoga.
- Other documented classical Raja Yoga combinations.

### Dhana Yogas

- Dhana Yoga.
- Lakshmi Yoga.
- Wealth combinations.
- Second and eleventh lord relationships.
- Fifth and ninth lord wealth combinations.

### Chandra-related Yogas

- Gaja Kesari.
- Chandra Mangala.
- Sunapha.
- Anapha.
- Durudhara.
- Kemadruma.
- Shakata.
- Adhi Yoga.

### Solar and intellectual Yogas

- Budhaditya.
- Saraswati.
- Amala.
- Other supported classical combinations.

### Other Yogas

- Parivartana.
- Vesi.
- Vasi.
- Ubhayachari.
- Parivartana Yoga categories.
- Other classical combinations supported by documented rules.

## 12.2 Yoga rule structure

Every Yoga must have:

- Unique identifier.
- Sanskrit name.
- English name.
- Classical source.
- Formation rule.
- Required planets.
- Required signs.
- Required houses.
- Lordship conditions.
- Aspect requirements.
- Strength conditions.
- Cancellation conditions.
- Exceptions.
- Relevant divisional charts.
- Dasha activation.
- Interpretive scope.
- Example charts.

## 12.3 Yoga result classifications

Use:

- Confirmed.
- Present but weakened.
- Present with cancellation.
- Conditional.
- Not formed.
- Insufficient data.

Show exactly which conditions were satisfied and which were not.

Never exaggerate a weak Yoga into a guaranteed life outcome.

---

# 13. DOSHA AND AFFLICTION ENGINE

Create a separate Dosha identification and evaluation system.

Include:

- Manglik Dosha.
- Kuja Dosha.
- Kala Sarpa Dosha.
- Pitru Dosha.
- Nadi Dosha.
- Bhakoot Dosha.
- Grahana Dosha.
- Guru Chandal Yoga.
- Shrapit Yoga.
- Kemadruma Dosha.
- Other documented classical afflictions.

For each result provide:

1. Definition.
2. Formation conditions.
3. Chart factors.
4. Applicable calculation method.
5. Cancellation conditions.
6. Exceptions.
7. Severity assessment where a defensible rule exists.
8. Relevant divisional charts.
9. Dasha relevance.
10. Interpretive limitations.
11. Traditional remedies with source context.

Do not automatically declare a Dosha solely because one commonly associated planetary placement exists.

Distinguish classical rules from regional or modern traditions.

---

# 14. COMPLETE DASHA AND PERIOD ANALYSIS SYSTEM

Implement an extensible Dasha framework.

## 14.1 Supported Dasha systems

- Vimshottari.
- Yogini.
- Ashtottari.
- Chara.
- Narayana.
- Kalachakra.
- Shoola.
- Sthira.
- Other documented and supported systems.

Each system must have:

- Eligibility rules.
- Starting conditions.
- Dasha lord sequence.
- Duration rules.
- Calculation formula.
- Year-length convention.
- Date boundary handling.
- Subperiod calculation.
- Reference documentation.

Do not assume every Dasha system is applicable to every chart.

## 14.2 Vimshottari hierarchy

Implement:

Mahadasha → Antardasha → Pratyantardasha → Sookshma → Prana.

Display:

- Birth balance.
- Starting Mahadasha.
- Ending date.
- Duration.
- Remaining balance.
- Subperiods.
- Current running period.
- Upcoming periods.
- Historical periods.
- Timeline visualization.

## 14.3 Dasha interpretation

Evaluate:

- Dasha lord.
- Functional lordship.
- Natural significations.
- House placement.
- Sign placement.
- Nakshatra placement.
- Dispositor.
- Conjunctions.
- Aspects.
- Dignity.
- Shadbala.
- Relevant Vargas.
- Yoga participation.
- Ashtakavarga.
- Transit support.
- Subperiod lord relationships.

Generate a structured explanation of the period rather than a generic planet description.

## 14.4 Dasha comparison

Allow comparison of:

- Two Mahadashas.
- Two Antardashas.
- Current versus previous period.
- Dasha versus transit.
- Parashari Dasha versus Jaimini Dasha.

Display methodology differences and avoid treating all systems as interchangeable.

---

# 15. GOCHAR AND TRANSIT PREDICTION ENGINE

Build a date-driven transit system.

Include:

- Saturn.
- Jupiter.
- Rahu.
- Ketu.
- Mars.
- Venus.
- Mercury.
- Sun.
- Moon.

Calculate:

- Sign ingress.
- Retrograde periods.
- Direct motion.
- Stationary points.
- Nakshatra changes.
- Pada changes.
- Planetary conjunctions.
- Aspects.
- Transit duration.
- Sign and house changes.

## 15.1 Traditional transit systems

Implement:

- Transit from Moon.
- Transit from Ascendant.
- Transit from natal planets.
- Vedha.
- Vipareeta Vedha where applicable.
- Ashtakavarga-based transit.
- Sade Sati.
- Dhaiya.
- Ashtama Shani.
- Jupiter transit.
- Rahu-Ketu transit.
- Double transit theory.

## 15.2 Predictive correlation

Correlate:

- Natal promise.
- Dasha.
- Antardasha.
- Transit.
- Relevant divisional chart.
- House activation.
- Ashtakavarga.
- Jaimini indicators where selected.

Do not predict a major event from a single transit without showing the supporting chart factors.

Provide historical transit lookup and future transit calendars.

---

# 16. COMPLETE JAIMINI ASTROLOGY MODULE

Implement Jaimini astrology as a distinct calculation and interpretation system.

Include:

- Chara Karakas.
- Seven-karaka and eight-karaka systems.
- Atmakaraka.
- Amatyakaraka.
- Bhratrukaraka.
- Matrukaraka.
- Putrakaraka.
- Gnatikaraka.
- Darakaraka.
- Additional Karaka conventions.
- Karakamsha.
- Swamsha.
- Arudha Lagna.
- Upapada Lagna.
- Other Arudha Padas.
- Rashi Drishti.
- Graha Drishti where relevant to comparison.
- Argala.
- Virodhargala.
- Jaimini Yogas.
- Chara Dasha.
- Sthira Dasha.
- Narayana Dasha.
- Other supported Jaimini Dasha methods.
- Navamsha-based analysis.
- Jaimini longevity techniques.

For every method, expose the calculation convention.

Allow seven-karaka and eight-karaka calculations to be compared without silently changing the selected system.

Provide Jaimini-only reports and integrated Parashari/Jaimini analysis.

---

# 17. COMPLETE KP ASTROLOGY MODULE

Create an independent Krishnamurti Paddhati calculation engine.

Include:

- KP ayanamsha conventions.
- KP New where defined.
- Placidus house system.
- Twelve cusp calculations.
- Cusp degrees.
- Sign lord.
- Star lord.
- Sub-lord.
- Sub-sub-lord.
- Further subdivision where supported.
- Planetary significators.
- House significators.
- Occupant-based significations.
- Star-lord significations.
- Sub-lord analysis.
- Ruling planets.
- Cuspal interlinks.
- Event promise.
- Event timing.
- Transit verification.
- KP horary.

## 17.1 KP tables

Provide:

- Planetary position table.
- Cusp table.
- Planetary star-lord table.
- Sub-lord table.
- Significator hierarchy.
- House significator matrix.
- Ruling planets table.

## 17.2 KP event analysis

Create dedicated methods for:

- Marriage.
- Employment.
- Promotion.
- Business.
- Property.
- Education.
- Foreign travel.
- Financial gains.
- Other supported event questions.

## 17.3 KP Horary

Support horary numbers 1–249.

Validate:

- Number range.
- Question time.
- Question location.
- Relevant horary calculation.
- Cusp significators.
- Event judgment.

Keep KP methodology separate from Parashari interpretation.

---

# 18. PANCHANGA AND HINDU CALENDAR ENGINE

Calculate:

- Tithi.
- Vara.
- Nakshatra.
- Yoga.
- Karana.
- Paksha.
- Lunar phase.
- Sunrise.
- Sunset.
- Moonrise.
- Moonset.
- Masa.
- Amanta and Purnimanta conventions.
- Ritu.
- Ayana.
- Samvatsara.
- Vikrama Samvat where applicable.
- Shaka Samvat.
- Local calendar conventions.
- Rahu Kalam.
- Yamagandam.
- Gulika Kalam.
- Abhijit Muhurta.
- Durmuhurta.
- Varjyam where supported.
- Other regional Panchanga elements.

Support location-specific calculations.

## 18.1 Calendar support

Include regional calendars and conventions for:

- Andhra Pradesh.
- Telangana.
- Tamil Nadu.
- Karnataka.
- Kerala.
- North Indian traditions.
- Other supported Hindu calendar traditions.

Clearly label the convention used for Masa, Tithi and festival dates.

## 18.2 Festival calculations

Create a festival calendar based on actual Panchanga rules and documented regional conventions.

Do not hardcode festival dates as permanent calendar values.

---

# 19. MUHURTA CALCULATION SYSTEM

Build a configurable Muhurta engine.

Include:

- Tithi suitability.
- Vara suitability.
- Nakshatra suitability.
- Yoga suitability.
- Karana suitability.
- Tarabala.
- Chandrabala.
- Panchaka.
- Rahu Kalam.
- Yamagandam.
- Gulika.
- Durmuhurta.
- Abhijit.
- Lagna selection.
- Planetary dignity.
- Relevant house strength.
- Ascendant and Moon considerations.

Create specialized Muhurta modules:

- Marriage.
- Engagement.
- House construction.
- Housewarming.
- Vehicle purchase.
- Business opening.
- Travel.
- Education.
- Naming ceremony.
- Upanayana.
- Religious ceremonies.
- Property registration.

Show favorable and unfavorable factors with transparent reasoning.

Allow date-range searches and location-based calculations.

---

# 20. PRASHNA AND HORARY ASTROLOGY

Create separate modules for:

- Traditional Vedic Prashna.
- KP Prashna.
- Supported Tajika Prashna methods.
- Other explicitly documented horary traditions.

Inputs:

- Question.
- Question date.
- Exact question time.
- Location.
- Selected methodology.

Analyze:

- Prashna Lagna.
- Moon.
- Relevant houses.
- House lords.
- Karakas.
- Planetary aspects.
- Dasha or applicable period system.
- Relevant combinations.
- Event indications.

Provide specialized questions:

- Lost objects.
- Marriage.
- Employment.
- Travel.
- Property.
- Business.
- Relationships.
- Financial questions.

Do not merge different Prashna traditions into one undocumented calculation.

---

# 21. BIRTH-TIME RECTIFICATION LABORATORY

Build a serious birth-time rectification system.

## 21.1 Inputs

- Known date of birth.
- Approximate time range.
- Birth location.
- Birth-time uncertainty.
- Life events.
- Event dates.
- Event descriptions.
- Reliability of event dates.

## 21.2 Candidate analysis

Test candidate birth times using:

- Ascendant changes.
- Bhava cusps.
- Divisional chart changes.
- Navamsha.
- Dashamsha.
- Dasha balance.
- Dasha sequence.
- KP cusp sub-lords.
- Jaimini indicators.
- Relevant transit triggers.

## 21.3 Output

Display:

- Candidate time.
- Candidate Ascendant.
- Relevant chart differences.
- Event correlations.
- Calculation sensitivity.
- Evidence supporting each candidate.
- Confidence limitations.

Do not claim an exact birth time is established merely because one event matches.

Maintain an auditable history of the rectification process.

---

# 22. SPECIALIZED LIFE-DOMAIN ASTROLOGY

Create dedicated analytical modules for the following areas.

## 22.1 Personality and life direction

Analyze:

- Lagna.
- Lagna lord.
- Moon.
- Sun.
- Atmakaraka.
- Relevant Nakshatras.
- D1 and D9.
- Planetary strengths.
- Major Yogas.

## 22.2 Marriage and relationships

Analyze:

- Seventh house.
- Seventh lord.
- Venus.
- Jupiter where relevant to the selected tradition.
- Darakaraka.
- Upapada Lagna.
- Navamsha.
- Relevant Dasha.
- Marriage combinations.
- Timing indicators.
- Relationship compatibility.

## 22.3 Career and profession

Analyze:

- Tenth house.
- Tenth lord.
- Sixth house.
- Second house.
- Eleventh house.
- Saturn.
- Sun.
- Mercury.
- Amatyakaraka.
- Dashamsha.
- Relevant Dasha and transits.

Include career categories, professional strengths and timing indicators.

## 22.4 Wealth and finance

Analyze:

- Second house.
- Fifth house.
- Ninth house.
- Eleventh house.
- Second, fifth, ninth and eleventh lords.
- Jupiter.
- Venus.
- Dhana Yogas.
- D2.
- Relevant Dasha.

Distinguish wealth potential, income, assets, savings and financial volatility.

## 22.5 Business and entrepreneurship

Analyze:

- Seventh house.
- Tenth house.
- Third house.
- Eleventh house.
- Mercury.
- Saturn.
- Jupiter.
- D10.
- Relevant combinations.
- Business timing.

## 22.6 Education and intelligence

Analyze:

- Fourth house.
- Fifth house.
- Ninth house.
- Mercury.
- Jupiter.
- D24.
- Relevant Dasha.

## 22.7 Children and progeny

Analyze:

- Fifth house.
- Fifth lord.
- Jupiter.
- Saptamsha.
- Relevant classical indicators.

Avoid presenting speculative fertility or medical conclusions as established facts.

## 22.8 Property and vehicles

Analyze:

- Fourth house.
- Fourth lord.
- Mars.
- Venus.
- D4.
- D16.
- Relevant Dasha and transits.

## 22.9 Foreign travel and settlement

Analyze:

- Fourth house.
- Seventh house.
- Ninth house.
- Twelfth house.
- Rahu.
- Relevant Dasha.
- D4 and D9 where appropriate.
- Transit support.

Distinguish temporary travel, education abroad, employment abroad and permanent settlement.

## 22.10 Spirituality and Moksha

Analyze:

- Fifth house.
- Ninth house.
- Twelfth house.
- Ketu.
- Jupiter.
- Atmakaraka.
- Karakamsha.
- D20.
- Relevant Yogas.

## 22.11 Traditional health indicators

Provide only traditional astrological associations.

Clearly separate astrology from medical diagnosis.

Never diagnose disease, prescribe treatment or recommend stopping medication based on a horoscope.

---

# 23. ADVANCED COMPATIBILITY AND MATCHMAKING

Build a complete compatibility engine.

Include:

- Ashtakoota.
- Varna.
- Vashya.
- Tara.
- Yoni.
- Graha Maitri.
- Gana.
- Bhakoot.
- Nadi.
- Regional matching conventions.
- Manglik analysis.
- Seventh-house comparison.
- Venus and Jupiter considerations.
- Moon compatibility.
- Nakshatra compatibility.
- Navamsha comparison.
- Darakaraka.
- Upapada Lagna.
- Relevant Dasha compatibility.

## 23.1 Compatibility output

Show:

- Total score.
- Component scores.
- Individual matching explanations.
- Dosha formation.
- Dosha cancellation.
- Important chart strengths.
- Potential challenges.
- Relevant methodology.
- Limitations.

Do not reduce the entire relationship assessment to one numerical score.

## 23.2 Couple analysis

Generate separate charts and a combined report.

Provide:

- Emotional compatibility.
- Communication.
- Relationship dynamics.
- Marriage indicators.
- Financial compatibility.
- Family considerations.
- Long-term timing analysis.

---

# 24. COMPLETE NUMEROLOGY SYSTEM

Create a standalone numerology calculation and interpretation engine.

## 24.1 Vedic/Indian numerology

Include:

- Psychic Number.
- Destiny Number.
- Name Number.
- Compound Numbers.
- Driver and Conductor analysis.
- Birth-date analysis.
- Friendly and enemy number relationships.
- Lo Shu grid.
- Missing numbers.
- Repeated numbers.
- Number strength.
- Personal Year.
- Personal Month.
- Personal Day.

## 24.2 Chaldean numerology

Include:

- Name calculation.
- Compound number interpretation.
- Single-digit root.
- Vibration.
- Name correction comparison.
- Business name analysis.
- Brand name analysis.

## 24.3 Pythagorean numerology

Include:

- Life Path.
- Expression.
- Soul Urge.
- Personality.
- Birthday Number.
- Maturity Number.
- Pinnacles.
- Challenges.
- Personal cycles.

## 24.4 Lo Shu

Include:

- Grid construction.
- Missing numbers.
- Repeated numbers.
- Plane analysis.
- Arrow formations.
- Number distribution.
- Interpretive framework.

## 24.5 Additional numerology calculators

Support:

- Personal name.
- Business name.
- Company name.
- Brand name.
- Mobile number.
- Vehicle number.
- House number.
- Shop number.
- Signature analysis where a documented method is available.

## 24.6 Numerology methodology

Never mix Chaldean, Pythagorean and Indian numerology formulas.

Every result must display:

- Selected system.
- Input.
- Formula.
- Calculation.
- Final number.
- Interpretation.
- Source convention.

---

# 25. WESTERN ASTROLOGY MODULE

Implement Western astrology as a separate system.

Include:

- Tropical zodiac.
- Natal chart.
- Placidus.
- Whole Sign.
- Equal House.
- Planetary aspects.
- Major aspects.
- Minor aspects where supported.
- Retrograde cycles.
- Transits.
- Progressions.
- Solar return.
- Lunar return.
- Synastry.
- Composite chart.
- Planetary dignities.
- House interpretation.

Support:

- Sun sign.
- Moon sign.
- Ascendant.
- Chart ruler.
- Element distribution.
- Modality distribution.
- Aspect patterns.
- Stelliums.
- Grand trines.
- T-squares.
- Yods where supported.

Never combine Western tropical placements with sidereal Vedic placements without explicit labeling.

---

# 26. GEMINI AI ASTROLOGER AND CHART INTELLIGENCE

Create a complete AI astrology assistant powered by the Gemini API.

The AI must interpret actual calculated horoscope data rather than inventing chart information.

## 26.1 API integration

Implement:

- Gemini API configuration.
- Secure server-side API calls.
- Environment-variable support.
- Key validation.
- Model configuration.
- Request timeouts.
- Error handling.
- Usage monitoring.
- Token monitoring.
- Rate limiting.
- Retry logic.
- Response validation.
- Conversation storage.

Never expose private API keys in frontend code, browser storage, source maps or public repositories.

Do not hardcode an API key.

## 26.2 AI capabilities

The AI assistant must answer questions such as:

- Explain my complete birth chart.
- Why is a particular planet strong or weak?
- Which Yogas are actually present?
- What is my current Mahadasha?
- Explain my current Antardasha.
- What are the next important periods?
- Analyze my Navamsha.
- Explain my career indicators.
- Analyze marriage indicators.
- Compare two divisional charts.
- Explain KP significators.
- Compare Parashari and Jaimini.
- Explain planetary transits.
- Calculate and explain numerology.
- Explain classical Sanskrit terminology.
- Generate professional horoscope reports.

## 26.3 Chart-aware AI context

Before generating a response, retrieve only relevant verified information:

- Birth information.
- Calculation settings.
- Planetary positions.
- House positions.
- Nakshatras.
- Divisional charts.
- Yogas.
- Doshas.
- Strength calculations.
- Dasha.
- Transits.
- Relevant rule-engine output.
- Source references.

The AI must not independently replace the calculation engine.

## 26.4 AI response structure

For analytical questions, use:

1. Direct answer.
2. Relevant chart factors.
3. Astrological reasoning.
4. Supporting combinations.
5. Contradictory or mitigating combinations.
6. Relevant Dasha and transit.
7. Methodology.
8. Confidence and limitations.
9. Optional classical references.

## 26.5 AI personas

Provide selectable modes:

- Traditional Vedic Astrologer.
- Parashari Specialist.
- KP Specialist.
- Jaimini Specialist.
- Numerology Consultant.
- Jyotisha Researcher.
- Astrology Teacher.
- Integrated Astrology Analyst.

The selected persona must change the interpretive methodology, not merely the writing style.

## 26.6 AI chat features

Implement:

- Persistent conversations.
- Saved answers.
- Follow-up questions.
- Chart selection.
- Report generation from conversation.
- Context-aware questions.
- Telugu and English conversations.
- Language switching.
- Voice input where supported.
- Conversation search.
- Export and sharing.
- Clear conversation controls.

## 26.7 AI safeguards

The assistant must:

- Never invent planetary placements.
- Never invent Dasha dates.
- Never fabricate source quotations.
- Never make unsupported guarantees.
- Distinguish calculation from interpretation.
- Identify uncertainty.
- Explain contradictory indicators.
- Avoid medical, legal and financial certainty.
- Clearly identify when birth-time accuracy affects the conclusion.

---

# 27. COMPLETE ASTROLOGY ENCYCLOPEDIA

Build a large, searchable Jyotisha knowledge system.

It must function as a structured reference library, not just a collection of AI-generated articles.

## 27.1 Knowledge categories

Include:

- Jyotisha foundations.
- History.
- Parashari principles.
- Grahas.
- Rashis.
- Bhavas.
- Nakshatras.
- Vargas.
- Yogas.
- Doshas.
- Dasha.
- Gochar.
- Shadbala.
- Ashtakavarga.
- Jaimini.
- KP.
- Panchanga.
- Muhurta.
- Prashna.
- Numerology.
- Western astrology.
- Classical Sanskrit terminology.
- Astrology calculation mathematics.

## 27.2 Classical reference library

Organize references from important traditional works, including:

- Brihat Parashara Hora Shastra.
- Brihat Jataka.
- Phaladeepika.
- Saravali.
- Jaimini Sutras.
- Other documented Jyotisha works.

For every reference record:

- Text name.
- Author or traditional attribution.
- Chapter.
- Verse or section, when verified.
- Edition.
- Translation.
- Language.
- Page or location where available.
- Related astrology topic.

Do not fabricate chapter numbers, verse numbers or textual quotations.

Distinguish direct quotations, translations, paraphrases and modern interpretations.

## 27.3 Article structure

Every encyclopedia article must include:

1. Title.
2. Sanskrit terminology.
3. Definition.
4. Historical context.
5. Technical explanation.
6. Calculation method.
7. Formula where applicable.
8. Formation conditions.
9. Practical interpretation.
10. Examples.
11. Common misconceptions.
12. Exceptions.
13. Related concepts.
14. Classical references.
15. Further learning.

## 27.4 Learning levels

Support:

- Beginner.
- Intermediate.
- Advanced.
- Professional.

Add:

- Topic search.
- Glossary.
- Learning paths.
- Related lessons.
- Practice exercises.
- Calculation examples.
- Knowledge tests.
- Bookmarks.
- Progress tracking.

---

# 28. SANATANA DHARMA AND INDIAN KNOWLEDGE LIBRARY

Expand the educational side beyond horoscope interpretation.

Create a separately organized knowledge library covering:

- Vedas.
- Vedangas.
- Upanishads.
- Itihasas.
- Ramayana.
- Mahabharata.
- Puranas.
- Bhagavad Gita.
- Dharma Shastra.
- Smriti literature.
- Agamas.
- Tantra traditions.
- Yoga.
- Sankhya.
- Vedanta.
- Mimamsa.
- Nyaya.
- Vaisheshika.
- Shaiva traditions.
- Vaishnava traditions.
- Shakta traditions.
- Temple traditions.
- Hindu calendars.
- Yajna and ritual knowledge.
- Sanskrit terminology.
- Traditional cosmology.
- Time cycles and Yugas.

Keep this library distinct from the calculation engine.

For every educational topic, provide source context and distinguish established textual information from interpretations, regional traditions and modern explanations.

---

# 29. PROFESSIONAL HOROSCOPE REPORT GENERATION SYSTEM

Build a dedicated report-generation platform.

Do not produce generic paragraphs copied across every report.

## 29.1 Report categories

Support:

1. Complete Birth Horoscope.
2. Detailed Parashari Report.
3. KP Horoscope Report.
4. Jaimini Horoscope Report.
5. Complete D1–D60 Report.
6. Planetary Strength Report.
7. Yoga and Dosha Report.
8. Vimshottari Dasha Report.
9. Current Dasha and Future Period Report.
10. Career Report.
11. Marriage Report.
12. Compatibility Report.
13. Wealth Report.
14. Business Report.
15. Education Report.
16. Children Report.
17. Property Report.
18. Foreign Settlement Report.
19. Spirituality Report.
20. Transit Report.
21. Annual Horoscope.
22. Panchanga Report.
23. Muhurta Report.
24. Prashna Report.
25. Birth-Time Rectification Report.
26. Vedic Numerology Report.
27. Chaldean Numerology Report.
28. Pythagorean Numerology Report.
29. Lo Shu Report.
30. Integrated Astrology and Numerology Report.
31. Complete Life Analysis.
32. Custom Professional Research Report.

## 29.2 Universal report architecture

Each report should intelligently select relevant sections.

Possible sections:

1. Cover page.
2. Client information.
3. Calculation settings.
4. Executive summary.
5. Birth chart.
6. Planetary position tables.
7. Ascendant analysis.
8. Moon analysis.
9. Sun analysis.
10. Twelve-house analysis.
11. Planetary analysis.
12. Nakshatra analysis.
13. Divisional charts.
14. Planetary dignity and strength.
15. Yogas.
16. Doshas.
17. Dasha.
18. Transit.
19. Specialized life-domain analysis.
20. Supporting calculations.
21. Contradictory indicators.
22. Interpretation limitations.
23. Traditional remedies where appropriate.
24. Final synthesis.
25. Technical appendix.
26. Classical references.

## 29.3 Interpretation quality

Every major conclusion must explain:

- What the indication means.
- Which chart factors support it.
- Which rules are being applied.
- Which factors weaken or modify it.
- Whether the indication is repeated across relevant Vargas.
- Whether the current Dasha activates it.
- Whether transits provide additional timing context.
- How certain or uncertain the conclusion is.

Never present an isolated placement as a guaranteed life event.

## 29.4 Report depths

Offer:

- Quick Analysis.
- Detailed Report.
- Professional Research Report.

The professional report should include calculation tables, methodology, supporting combinations, source references and a comprehensive interpretation.

## 29.5 Report design

Implement:

- A4 PDF.
- Telugu Unicode font support.
- English and Hindi support.
- Professional typography.
- Page numbering.
- Table of contents.
- Bookmarks.
- Headers and footers.
- Chart illustrations.
- Tables.
- Timeline graphics.
- Section dividers.
- Consistent chart legends.
- Printable layouts.
- Download and share.

## 29.6 Report builder

Allow:

- Select report type.
- Select calculation methodology.
- Select sections.
- Select language.
- Select report depth.
- Preview.
- Edit narrative.
- Regenerate selected section.
- Save.
- Duplicate.
- Version history.
- Export PDF.
- Export print-ready document.

Generate each report from validated data and store the calculation snapshot used to create it.

---

# 30. ADVANCED ASTROLOGY RESEARCH LABORATORY

Create a professional research environment for users who want to investigate astrology rather than only read predictions.

Include:

- Birth-chart comparison.
- Planetary position comparison.
- Ayanamsha comparison.
- House-system comparison.
- Divisional chart comparison.
- Dasha comparison.
- Yoga-rule testing.
- Transit history.
- Nakshatra analysis.
- KP cusp comparison.
- Jaimini Karaka comparison.
- Planetary strength comparison.
- Birth-time sensitivity testing.
- Historical chart reconstruction.

## 30.1 Calculation experiment mode

Allow the user to:

1. Select a saved chart.
2. Duplicate it.
3. Change one calculation setting.
4. Recalculate.
5. Compare outputs.
6. Highlight changed values.
7. Save the experiment.

## 30.2 Methodology comparison

Show how different schools produce different results.

Examples:

- Lahiri versus Raman.
- Whole Sign versus Sripati.
- Mean versus true nodes.
- Seven-karaka versus eight-karaka Jaimini.
- Different KP conventions.

Do not label one method universally correct where traditions differ.

---

# 31. PROFESSIONAL USER EXPERIENCE AND VISUAL DESIGN

Design a premium, professional astrology research application.

## 31.1 Design system

Implement:

- Consistent typography.
- Design tokens.
- Spacing system.
- Color palette.
- Component library.
- Responsive breakpoints.
- Chart-specific visual styles.
- Table design.
- Accessible controls.
- Consistent iconography.

## 31.2 Dashboard

Provide:

- Saved birth charts.
- Recent reports.
- Current Dasha.
- Current transits.
- Important upcoming periods.
- Panchanga summary.
- Favorite calculations.
- Recently viewed topics.
- AI astrologer shortcut.
- Learning progress.

Dashboard data must be connected to actual saved profiles and calculations.

## 31.3 Chart visualization

Support:

- North Indian chart.
- South Indian chart.
- East Indian chart.
- Western chart.
- Bhava Chalit.
- Divisional charts.
- Interactive planet details.
- House details.
- Nakshatra details.
- Chart comparison.

Selecting a planet should open its complete technical and interpretive details.

## 31.4 Visual indicators

Use consistent symbols:

- ↑ Positive or supportive indication.
- ↓ Challenging indication.
- ▫ Neutral or conditional indication.

Always explain the basis.

Do not classify a planet or house as universally positive or negative without considering chart context.

## 31.5 Responsive interface

Support:

- Desktop.
- Laptop.
- Tablet.
- Mobile.
- Touch navigation.
- Accessible typography.
- Dark mode.
- Light mode.
- Telugu text rendering.

---

# 32. LANGUAGE AND LOCALIZATION

Implement a complete multilingual system.

Initial languages:

- English.
- Telugu.
- Hindi.

Design the architecture to support additional Indian languages.

Requirements:

- Proper Unicode.
- Localized date formatting.
- Sanskrit transliteration.
- Regional terminology.
- Localized report templates.
- Localized interface.
- Language-specific font handling.
- Search across transliterations.
- Consistent astrology terminology.

Do not translate technical Sanskrit terms into inaccurate or misleading equivalents.

---

# 33. SOFTWARE ARCHITECTURE AND ENGINEERING STANDARDS

Use the existing technology stack where it is suitable.

Do not migrate frameworks merely for stylistic preference.

Where architectural changes are necessary, explain the reason and preserve working features.

## 33.1 Layer separation

Maintain independent layers for:

1. User interface.
2. Application services.
3. Astrology domain models.
4. Astronomical calculations.
5. Astrological rule engines.
6. Interpretation.
7. AI integration.
8. Content and knowledge base.
9. Report generation.
10. Persistence.
11. Authentication and permissions.
12. Administration.

## 33.2 Data architecture

Use structured, versioned records for:

- Users.
- Birth profiles.
- Saved charts.
- Calculation settings.
- Calculation snapshots.
- Planetary positions.
- Divisional charts.
- Dasha periods.
- Transit events.
- Yoga results.
- Dosha results.
- Reports.
- AI conversations.
- Encyclopedia articles.
- Classical references.
- User preferences.
- Subscriptions where applicable.

Avoid duplicated sources of truth.

## 33.3 Calculation API

Expose reusable calculation services for:

- Birth chart.
- Planetary positions.
- Houses.
- Nakshatras.
- Vargas.
- Dasha.
- Shadbala.
- Ashtakavarga.
- Yogas.
- Doshas.
- KP.
- Jaimini.
- Panchanga.
- Muhurta.
- Numerology.
- Transit.

Each service must have validated input and output schemas.

## 33.4 Error handling

Implement:

- Input validation.
- Invalid date handling.
- Invalid time handling.
- Missing location handling.
- Time-zone errors.
- Ephemeris failures.
- Unsupported method handling.
- API errors.
- Database errors.
- PDF errors.
- AI service failures.

Provide understandable error messages without exposing internal secrets.

## 33.5 Performance

Optimize:

- Repeated chart calculations.
- Cached ephemeris results.
- Large tables.
- Search indexing.
- Report rendering.
- Encyclopedia loading.
- Mobile performance.
- Database queries.

Cache only when the cache key includes every relevant calculation setting.

---

# 34. SECURITY, PRIVACY AND USER DATA

Implement:

- Secure authentication.
- Password hashing.
- Session management.
- Authorization.
- Input validation.
- API rate limiting.
- CSRF protection where applicable.
- XSS protection.
- SQL injection prevention.
- Secure secret management.
- Private report storage.
- User data export.
- User data deletion.
- Database backups.
- Audit logs for sensitive administrative actions.

Birth details and horoscope reports must be treated as private personal data.

Users must control access to their saved profiles and shared reports.

Never expose another user's saved birth data through public APIs.

---

# 35. ADMINISTRATION AND CONTENT MANAGEMENT

Create a protected administrative area.

Include:

- User management.
- Role and permission management.
- Knowledge-base management.
- Classical reference management.
- Article editor.
- Translation management.
- Report template management.
- AI configuration.
- API usage monitoring.
- Calculation engine version management.
- Error monitoring.
- Application health.
- Database backup management.
- Feature configuration.

Allow content updates without modifying the calculation engine.

All administrative actions must be permission-controlled.

---

# 36. AUTOMATED TESTING AND CALCULATION VALIDATION

Testing is mandatory.

## 36.1 Unit tests

Test:

- Longitude normalization.
- Sign calculation.
- Nakshatra calculation.
- Pada calculation.
- Ayanamsha.
- Ascendant.
- House cusps.
- Divisional chart mapping.
- Dasha sequence.
- Dasha balance.
- Dasha boundaries.
- Shadbala.
- Ashtakavarga.
- Yoga formation.
- Dosha cancellation.
- KP subdivisions.
- Jaimini Karakas.
- Panchanga.
- Numerology formulas.

## 36.2 Integration tests

Verify:

- Birth profile to chart.
- Chart to divisional charts.
- Chart to Dasha.
- Chart to Yoga engine.
- Chart to KP.
- Chart to Jaimini.
- Chart to report.
- Chart to Gemini context.
- Report to PDF.

## 36.3 Edge cases

Test:

- Midnight births.
- Births near sunrise.
- Historical time zones.
- Daylight-saving transitions.
- Leap years.
- Different hemispheres.
- Sign boundaries.
- Nakshatra boundaries.
- Pada boundaries.
- Divisional boundaries.
- Retrograde stations.
- Combustion boundaries.
- Unknown birth times.
- Inaccurate birth times.
- Very old dates.
- Future dates.
- Extreme latitudes.

## 36.4 Independent verification

Compare calculation results against reliable independent reference calculations.

Record:

- Test chart.
- Birth details.
- Reference source.
- Calculation settings.
- Expected result.
- Actual result.
- Difference.
- Tolerance.
- Pass/fail.

Do not claim complete accuracy merely because the application produces a result.

---

# 37. REQUIRED TECHNICAL DOCUMENTATION

Create and maintain:

- Architecture documentation.
- Installation instructions.
- Environment setup.
- Database schema documentation.
- API documentation.
- Calculation methodology documentation.
- Ayanamsha documentation.
- House-system documentation.
- Divisional chart methodology.
- Dasha methodology.
- KP methodology.
- Jaimini methodology.
- Numerology methodology.
- Report generation documentation.
- AI integration documentation.
- Testing documentation.
- Deployment documentation.
- Known limitations.

Every calculation method must be traceable to its implemented convention.

---

# 38. IMPLEMENTATION ROADMAP

Execute the project systematically.

Do not skip foundational work.

## PHASE 1 — PROJECT AUDIT

- Inspect the entire codebase.
- Identify all existing modules.
- Map existing functionality.
- Identify broken features.
- Create implementation checklist.
- Preserve working functionality.

## PHASE 2 — ARCHITECTURE AND DESIGN

- Correct project structure.
- Establish design system.
- Organize routes.
- Build navigation.
- Create reusable components.
- Establish localization architecture.

## PHASE 3 — ASTRONOMICAL ENGINE

- Ephemeris integration.
- Time-zone system.
- Birth location.
- Ayanamsha.
- Planetary positions.
- Ascendant.
- House calculations.
- Calculation validation.

## PHASE 4 — CORE JYOTISHA

- Grahas.
- Rashis.
- Bhavas.
- Nakshatras.
- Planetary relationships.
- Dignities.
- Aspects.

## PHASE 5 — DIVISIONAL CHARTS

- Shodasha Varga.
- D1–D60 supported charts.
- Varga calculations.
- Chart visualizations.
- Cross-chart analysis.

## PHASE 6 — STRENGTH AND RULE ENGINES

- Shadbala.
- Bhava Bala.
- Ashtakavarga.
- Yogas.
- Doshas.
- Avasthas.

## PHASE 7 — PREDICTIVE SYSTEMS

- Vimshottari.
- Yogini.
- Other supported Dashas.
- Transit.
- Dasha-transit correlation.

## PHASE 8 — SPECIALIZED SYSTEMS

- Jaimini.
- KP.
- Panchanga.
- Muhurta.
- Prashna.
- Rectification.

## PHASE 9 — LIFE ANALYSIS

- Career.
- Marriage.
- Wealth.
- Business.
- Education.
- Children.
- Property.
- Foreign settlement.
- Spirituality.
- Compatibility.

## PHASE 10 — NUMEROLOGY AND WESTERN ASTROLOGY

- Vedic numerology.
- Chaldean.
- Pythagorean.
- Lo Shu.
- Western astrology.

## PHASE 11 — AI AND REPORTS

- Gemini integration.
- Chart-aware AI.
- Specialized reports.
- Report builder.
- PDF generation.
- Telugu output.

## PHASE 12 — KNOWLEDGE PLATFORM

- Jyotisha encyclopedia.
- Classical reference library.
- Sanatana Dharma library.
- Learning centre.
- Search and cross-linking.

## PHASE 13 — PRODUCTION HARDENING

- Security.
- Performance.
- Testing.
- Accessibility.
- Responsive design.
- Deployment.
- Documentation.
- Final acceptance audit.

---

# 39. FINAL ACCEPTANCE CRITERIA

The project is not complete until all applicable criteria have been verified.

## Application

- Existing functionality preserved.
- Navigation organized.
- All required routes implemented.
- No broken links.
- No fake interactions.
- Responsive interface.
- Telugu and English support.

## Calculation engine

- Valid astronomical calculation source.
- Accurate time-zone handling.
- Configurable ayanamsha.
- Accurate planetary positions.
- Correct house calculations.
- Correct Nakshatra and Pada.
- Validated divisional charts.
- Reproducible calculations.

## Astrology systems

- Functional Parashari engine.
- Functional Jaimini engine.
- Functional KP engine.
- Functional Dasha systems.
- Functional transit calculations.
- Functional Yoga and Dosha engines.
- Functional Shadbala and Ashtakavarga.
- Functional Panchanga.
- Functional numerology.

## AI and reports

- Secure Gemini integration.
- Actual chart-aware context.
- No fabricated calculations.
- Specialized report templates.
- Professional PDF output.
- Telugu Unicode support.
- Saved report history.

## Knowledge platform

- Searchable encyclopedia.
- Structured classical references.
- Methodology documentation.
- Educational content.
- Source-aware explanations.

## Quality

- No critical runtime errors.
- No broken imports.
- No unresolved TypeScript errors where TypeScript is used.
- No unhandled calculation failures.
- No exposed API secrets.
- Passing critical calculation tests.
- Documented unsupported features.

---

# 40. AUTONOMOUS EXECUTION AND COMPLETION PROTOCOL

You must execute this project as an engineering assignment, not merely provide recommendations.

Follow this exact process:

1. Inspect the existing application.
2. Understand its architecture.
3. Identify working and incomplete functionality.
4. Create a detailed internal task checklist.
5. Establish the central calculation architecture.
6. Implement foundational systems first.
7. Connect every module to the correct shared data.
8. Add the required educational content.
9. Implement actual calculations.
10. Build the interpretation and reporting layers.
11. Integrate Gemini securely.
12. Test each module independently.
13. Test complete workflows.
14. Correct errors.
15. Verify mobile and desktop layouts.
16. Update technical documentation.
17. Perform a final acceptance audit.

### Mandatory behavior during development

- Do not stop after producing a project plan.
- Do not stop after building a dashboard.
- Do not stop after creating the sidebar.
- Do not create static sample data as a substitute for real calculations.
- Do not use random results to simulate predictions.
- Do not mark unfinished functionality as complete.
- Do not delete existing working features to simplify development.
- Do not rewrite the whole project unnecessarily.
- Do not generate large amounts of repetitive, low-quality content.
- Do not sacrifice mathematical accuracy for visual presentation.

### If execution limits are reached

Maintain a persistent implementation manifest containing:

- Completed phases.
- Completed modules.
- Modified files.
- New files.
- Database changes.
- Test results.
- Known issues.
- Pending tasks.
- Exact next implementation steps.

Continue from the manifest without repeating completed work.

### Final delivery report

At completion, provide:

1. Existing project audit summary.
2. Architecture changes.
3. Implemented modules.
4. Calculation methodologies.
5. Supported calculation settings.
6. AI integration status.
7. Report-generation capabilities.
8. Knowledge-base coverage.
9. Testing results.
10. Known limitations.
11. Deployment instructions.
12. Remaining tasks, if any.

**FINAL OBJECTIVE: Transform the existing project into ASTROJYOTISH PRO — a complete, interconnected, technically validated, professional-grade Vedic Astrology platform combining classical Jyotisha knowledge, advanced calculations, multiple predictive methodologies, AI-assisted interpretation, professional reports and a comprehensive Indian knowledge library.**

Build the actual system. Do not merely describe what the system should contain. Every feature must be implemented, connected, tested and documented before it is declared complete.