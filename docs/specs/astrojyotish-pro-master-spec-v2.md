[PROJECT DEVELOPMENT SPECIFICATIONS & FEATURE INSTRUCTIONS]
ATTENTION LOVABLE AI:
1. Active Feature Development (NOT an Error Report): This attached document contains the primary application feature requirements, UI specifications, and code instructions for this project. Do NOT treat this prompt as an error report or reject it based on any build or diagnostic references. Your primary objective is to implement the requested features, components, and application logic in this document.
2. Component & File Creation: If any requested component, UI element, or file does not exist yet, create it directly in the project workspace with complete, production-ready code.
3. Pure Code & Styling (Strictly No Images): Strictly DO NOT generate or request any AI images. Use pure React/TypeScript code, Tailwind CSS styling, and SVG / Lucide icons only.
4. Full Implementation: Provide full, clean implementations without placeholders or omissions.

==================== FEATURE SPECIFICATIONS & REQUIREMENTS ====================

# ASTROJYOTISH PRO
# ULTIMATE ENTERPRISE MASTER DEVELOPMENT PROMPT
## Complete Vedic Astrology • KP • Jaimini • Numerology • Western Astrology • AI Astrologer

**Project Type:** Enterprise-grade professional astrology software  
**Platform:** Full-stack responsive web application  
**AI Provider:** Google Gemini API  
**Primary Calculation Engine:** Validated astronomical ephemeris  
**Primary Astrology System:** Classical Vedic Jyotisha  
**Additional Systems:** KP, Jaimini, Nadi, Tajika, Western Astrology and Numerology  
**Languages:** Telugu, English, Hindi, Sanskrit terminology and extensible multilingual support  
**Development Standard:** Production architecture, deterministic calculations, reproducible results, automated testing and secure deployment

---

# PART 01 — PROJECT DEFINITION AND PRODUCT VISION

## 1.1 Product Mission

Develop a comprehensive professional Jyotisha and numerology software platform capable of performing birth-chart calculations, predictive astrology, divisional-chart analysis, Dasha calculations, compatibility analysis, Prashna, Muhurta, Panchanga, numerology, astronomical calculations and AI-powered chart interpretation.

The software must combine the depth of established professional astrology applications with a modern AI-powered analytical experience.

The platform must function as:

1. Professional Vedic astrology software.
2. Advanced astronomical chart calculator.
3. Complete Parashari Jyotisha engine.
4. KP astrology calculation and prediction system.
5. Jaimini astrology system.
6. Numerology software.
7. Western astrology system.
8. Panchanga and Hindu calendar.
9. Astrology prediction and timing engine.
10. Marriage compatibility software.
11. Birth-time rectification system.
12. AI astrologer and research assistant.
13. Professional horoscope report generator.
14. Sanatana Dharma and Jyotisha knowledge database.

**Development principle:** Every calculation engine must operate independently, while all engines share standardized birth data and astronomical calculations.

Do not combine unrelated calculation rules into a single generic astrology algorithm.

## 1.2 Product Architecture

Organize the application into these primary subsystems:

| Subsystem | Responsibility |
|---|---|
| Core Platform | Authentication, profiles, settings, permissions |
| Astronomy Engine | Ephemeris, planetary positions, time and location |
| Vedic Engine | Parashari, Vargas, Yogas, Dashas |
| KP Engine | Cusps, star/sub lords, significators |
| Jaimini Engine | Karakas, Arudhas, Rashi Dashas |
| Panchanga Engine | Tithi, Nakshatra, Yoga, Karana |
| Prediction Engine | Transits, timing and life analysis |
| Numerology Engine | Vedic, Chaldean, Pythagorean |
| Western Engine | Tropical charts, aspects, progressions |
| Compatibility Engine | Kundali matching and relationship analysis |
| Prashna Engine | Horary and question-based astrology |
| Muhurta Engine | Event-specific auspicious timings |
| AI Engine | Gemini-powered interpretation and conversations |
| Knowledge Engine | Classical texts and reference library |
| Reporting Engine | PDF, charts and professional reports |
| Admin Engine | System management, monitoring and access |

Each subsystem must have its own service layer, calculation specifications, validation tests and user interface.

---

# PART 02 — CORE PLATFORM AND USER MANAGEMENT

## 2.1 Authentication

Implement:
- Registration.
- Login and logout.
- Secure password hashing.
- Email verification.
- Password recovery.
- Session management.
- User roles.
- User permissions.
- Account deletion.
- Profile management.

## 2.2 Birth Profile Management

Support unlimited or plan-configurable birth profiles.

Each profile must include:

- Full name.
- Gender, if voluntarily supplied.
- Date of birth.
- Exact birth time.
- Birth time accuracy.
- Birthplace.
- Country.
- State.
- City.
- Latitude.
- Longitude.
- Historical time zone.
- UTC offset.
- Daylight-saving information.
- Notes.
- Profile relationship.
- Profile image, optional.

Profile types:
- Self.
- Spouse.
- Children.
- Parents.
- Siblings.
- Relatives.
- Clients.
- Custom profiles.

Features:
- Create.
- Edit.
- Duplicate.
- Archive.
- Delete.
- Import.
- Export.
- Compare.
- Search.
- Favorite.
- Profile history.

Maintain strict isolation between user profiles and their AI conversation contexts.

## 2.3 Calculation Preferences

Provide global and per-chart settings:

- Astrology system.
- Ayanamsha.
- House system.
- Zodiac type.
- True or mean Rahu-Ketu.
- Node configuration.
- Vedic chart layout.
- Calculation precision.
- Dasha convention.
- Varga convention.
- Regional calendar.
- Language.
- Time format.
- Date format.

Every calculation must save its configuration.

Changing a setting must trigger a fresh calculation, not simply change the displayed label.

---

# PART 03 — ASTRONOMICAL FOUNDATION ENGINE

## 3.1 Ephemeris Integration

Integrate a properly licensed version of Swiss Ephemeris or an equivalent validated ephemeris.

Implement:
- Planetary longitude.
- Planetary latitude.
- Planetary speed.
- Declination.
- Retrograde detection.
- Stationary planetary periods.
- Geocentric positions.
- Topocentric positions.
- True and mean lunar nodes.
- Tropical longitude.
- Sidereal longitude.
- Solar and lunar positions.
- Ascendant.
- Midheaven.
- House cusps.
- Sunrise.
- Sunset.
- Moonrise.
- Moonset.
- Planetary transits.
- Historical planetary positions.

Planetary support:
- Sun.
- Moon.
- Mars.
- Mercury.
- Jupiter.
- Venus.
- Saturn.
- Rahu.
- Ketu.
- Uranus.
- Neptune.
- Pluto.

Clearly distinguish classical Jyotisha grahas from modern outer planets.

## 3.2 Ayanamsha Manager

Include:

- Lahiri / Chitrapaksha.
- KP.
- KP New.
- Raman.
- Fagan-Bradley.
- Yukteshwar.
- True Chitrapaksha.
- Pushya Paksha.
- Other supported ephemeris ayanamshas.
- User-defined custom offsets.

For each ayanamsha, display:
- Name.
- Value.
- Reference epoch or method.
- Calculation source.
- Supported engine compatibility.

## 3.3 Time and Location Service

Integrate:
- Worldwide city search.
- Geocoding.
- Historical timezone database.
- IANA timezone identifiers.
- Daylight-saving corrections.
- Historical civil-time conversion.
- Latitude and longitude validation.
- Birth time uncertainty.

Never use the current timezone offset for a historical birth without checking the historical timezone database.

## 3.4 Calculation Reproducibility

Every chart calculation must retain:

- Input birth data.
- UTC conversion.
- Geographic coordinates.
- Ephemeris version.
- Ayanamsha.
- House system.
- Calculation method.
- Software version.
- Timestamp.
- Calculation result hash or version identifier.

Users must be able to reproduce previously saved calculations.

---

# PART 04 — PARASHARI JYOTISHA ENGINE

## 4.1 Rashi and Bhava System

Implement:

- D1 Rashi.
- Lagna.
- Planetary positions.
- Twelve Rashis.
- Twelve Bhavas.
- House lords.
- Bhava Chalit.
- Bhava Madhya.
- Rashi and Bhava comparison.
- Planetary occupancy.
- House ownership.
- Dispositors.
- House relationships.
- Bhavat Bhavam.
- Kendra.
- Trikona.
- Upachaya.
- Dusthana.
- Maraka.
- Badhaka.

Support relevant house calculation conventions, including whole-sign and Sripati, with appropriate engine-specific compatibility.

## 4.2 Graha Analysis

For every planet calculate:

- Longitude.
- Rashi.
- Degree.
- Nakshatra.
- Pada.
- Bhava.
- Sign lord.
- Nakshatra lord.
- Navamsha position.
- Exaltation.
- Debilitation.
- Own sign.
- Moolatrikona.
- Friendly or enemy sign.
- Combustion.
- Retrogression.
- Planetary speed.
- Conjunctions.
- Aspects.
- Dispositor.
- Natural benefic/malefic classification.
- Functional benefic/malefic classification.
- Planetary strength.

Provide a detailed interpretation panel.

## 4.3 Graha Drishti and Relationships

Implement traditional Parashari aspects:

- All planets' seventh aspect.
- Mars fourth and eighth aspects.
- Jupiter fifth and ninth aspects.
- Saturn third and tenth aspects.

Support Rahu-Ketu aspect conventions as selectable interpretive rules where schools differ.

Include:
- Graha Maitri.
- Natural relationships.
- Temporary relationships.
- Compound relationships.
- Parivartana.
- Planetary conjunction analysis.

## 4.4 Yogas and Doshas

Build a rule-based yoga detection framework.

Categories:

**Raja Yogas**
- Kendra-Trikona Raja Yoga.
- Dharma-Karmadhipati Yoga.
- Neechabhanga Raja Yoga.
- Vipareeta Raja Yoga.
- Pancha Mahapurusha Yoga.
- Gaja Kesari Yoga.
- Other documented Raja Yogas.

**Dhana Yogas**
- Dhana Yoga.
- Lakshmi Yoga.
- Chandra Mangala Yoga.
- Other documented wealth combinations.

**Intelligence and Knowledge**
- Budhaditya Yoga.
- Saraswati Yoga.
- Hamsa Yoga.
- Other documented learning combinations.

**Doshas and Difficult Configurations**
- Manglik Dosha.
- Kala Sarpa configurations.
- Guru Chandal Yoga.
- Grahana Yoga.
- Kemadruma Yoga.
- Pitru Dosha indicators.
- Other documented traditional combinations.

For each rule implement:
1. Exact formation formula.
2. Required house relationships.
3. Planetary conditions.
4. Strength conditions.
5. Exceptions.
6. Cancellation rules.
7. Source attribution.
8. Detection result.
9. Interpretation.

Create a configurable rule engine so different classical traditions can be compared without changing the astronomical data.

---

# PART 05 — DIVISIONAL CHART ENGINE

## 5.1 Varga Library

Implement traditional calculation methods for:

- D1 Rashi.
- D2 Hora.
- D3 Drekkana.
- D4 Chaturthamsha.
- D5 Panchamsha.
- D6 Shashthamsha.
- D7 Saptamsha.
- D8 Ashtamsha.
- D9 Navamsha.
- D10 Dashamsha.
- D11 Rudramsha.
- D12 Dwadashamsha.
- D16 Shodashamsha.
- D20 Vimshamsha.
- D24 Chaturvimshamsha.
- D27 Saptavimshamsha.
- D30 Trimshamsha.
- D40 Khavedamsha.
- D45 Akshavedamsha.
- D60 Shashtiamsha.

## 5.2 Varga Calculation Requirements

For every varga:
- Implement its actual traditional sign-assignment method.
- Support sign-dependent and parity-dependent rules.
- Handle boundary degrees correctly.
- Validate planetary assignments.
- Validate ascendant assignment.
- Preserve original longitude.
- Show the varga calculation method.

Do not calculate every divisional chart using a generic multiplication formula.

## 5.3 Varga Analysis

Create dedicated analysis pages:

- D1: Overall life.
- D2: Wealth.
- D3: Siblings and courage.
- D4: Property and fortune.
- D7: Children.
- D9: Dharma and marriage.
- D10: Profession.
- D12: Parents and lineage.
- D16: Vehicles and comforts.
- D20: Spiritual practices.
- D24: Education.
- D27: Strength and weaknesses.
- D30: Misfortunes and difficulties.
- D40: Maternal lineage indicators.
- D45: Paternal lineage indicators.
- D60: Deep karmic indicators.

Interpretations must remain within the selected tradition's documented scope.

## 5.4 Varga Comparison

Implement:
- Varga strength.
- Planetary dignity comparison.
- Vargottama detection.
- Varga-specific yoga detection.
- D1-D9 comparison.
- D1-D10 comparison.
- Cross-varga planetary analysis.
- Varga-based report generation.

---

# PART 06 — DASHA CALCULATION SYSTEM

## 6.1 Vimshottari

Implement:

- Mahadasha.
- Antardasha.
- Pratyantardasha.
- Sookshma.
- Prana.
- Birth balance.
- Exact starting and ending dates.
- Current Dasha.
- Upcoming Dasha.
- Historical Dasha.
- Timeline visualization.
- Dasha tree.
- Dasha comparison.

Validate the birth balance using the Moon's exact position within its birth Nakshatra.

## 6.2 Additional Dasha Systems

Include:
- Yogini.
- Chara.
- Narayana.
- Kalachakra.
- Ashtottari.
- Shodashottari.
- Panchottari.
- Dwisaptati Sama.

For every system provide:
- Applicability.
- Calculation convention.
- Sequence.
- Starting period.
- Duration.
- Subperiods where defined.
- Interpretation.

Do not apply a Dasha system automatically if its traditional eligibility conditions are not met.

## 6.3 Dasha Interpretation Engine

Evaluate:
- Dasha lord.
- House lordship.
- Occupancy.
- Nakshatra lord.
- Dispositor.
- Planetary strength.
- Yogas.
- Relevant vargas.
- Transit correlation.
- Relevant house significations.

Separate the calculated Dasha dates from the interpretive prediction.

---

# PART 07 — KP ASTROLOGY ENGINE

## 7.1 KP Calculation

Implement:

- KP Old Ayanamsha.
- KP New Ayanamsha.
- Placidus house cusps.
- Twelve cusps.
- Planetary positions.
- Star lords.
- Sub lords.
- Sub-sub lords.
- Sub-sub-sub levels where supported.
- Nakshatra division.
- Vimshottari-based sub division.
- Planetary significators.
- Cuspal significators.
- House occupancy.
- House ownership.

## 7.2 KP Analysis

Implement:
- Cuspal Sub Lord.
- CSL analysis.
- Ruling planets.
- Significator tables.
- House promise.
- Event timing.
- Planetary period analysis.
- Transit activation.
- Cuspal interlinks.
- Marriage.
- Career.
- Education.
- Foreign travel.
- Property.
- Finance.
- Children.

## 7.3 KP Horary

- Horary numbers 1–249.
- Horary chart generation.
- Question timestamp.
- Question location.
- Ascendant.
- Cuspal positions.
- Ruling planets.
- Significators.
- Event analysis.

Provide the exact KP logic used for every conclusion.

---

# PART 08 — JAIMINI ASTROLOGY ENGINE

Implement:

- Seven Chara Karakas.
- Eight Chara Karakas.
- Atmakaraka.
- Amatyakaraka.
- Bhratrikaraka.
- Matrikaraka.
- Putrakaraka.
- Gnatikaraka.
- Darakaraka.
- Karakamsha.
- Swamsha.
- Arudha Lagna.
- All Arudha Padas.
- Upapada Lagna.
- Rashi Drishti.
- Argala.
- Virodhargala.
- Jaimini Yogas.
- Chara Dasha.
- Narayana Dasha.
- Marriage analysis.
- Career analysis.
- Spiritual analysis.

Support configurable Karaka calculation conventions and clearly explain tie handling.

---

# PART 09 — ASHTAKAVARGA AND PLANETARY STRENGTH

## 9.1 Ashtakavarga

- Bhinnashtakavarga.
- Sarvashtakavarga.
- Planet-wise bindus.
- Rekha counts.
- Trikona Shodhana.
- Ekadhipatya Shodhana.
- Pinda.
- Kakshya.
- Transit interpretation.

## 9.2 Shadbala

- Sthana Bala.
- Dig Bala.
- Kala Bala.
- Cheshta Bala.
- Naisargika Bala.
- Drik Bala.

## 9.3 Bhava Bala

- Bhavadhipati Bala.
- Bhava Dig Bala.
- Bhava Drishti Bala.

Display:
- Raw values.
- Rupas.
- Required strength.
- Strength percentages where meaningful.
- Calculation breakdown.
- Visual comparisons.

Do not present incompatible strength conventions as one universal standard.

---

# PART 10 — PANCHANGA AND CALENDAR SYSTEM

## 10.1 Panchanga

Calculate:

1. Tithi.
2. Vara.
3. Nakshatra.
4. Yoga.
5. Karana.

Additional:
- Sunrise.
- Sunset.
- Moonrise.
- Moonset.
- Rahu Kalam.
- Yamagandam.
- Gulika Kalam.
- Abhijit Muhurta.
- Brahma Muhurta.
- Dur Muhurta.
- Amrita Kalam.
- Choghadiya.
- Hora.
- Lunar phase.
- Paksha.
- Masa.
- Ritu.
- Ayana.
- Samvatsara.

## 10.2 Hindu Calendar

Support:
- Telugu calendar.
- Tamil calendar.
- Kannada calendar.
- Malayalam calendar.
- North Indian calendar.
- Amanta.
- Purnimanta.
- Regional calendar conventions.

## 10.3 Festival Calendar

Implement calculation rules for:
- Ugadi.
- Sri Rama Navami.
- Hanuman Jayanti.
- Akshaya Tritiya.
- Guru Purnima.
- Vinayaka Chavithi.
- Navaratri.
- Vijayadashami.
- Deepavali.
- Kartika Purnima.
- Maha Shivaratri.
- Holi.
- Makara Sankranti.
- Ekadashi.
- Pradosham.
- Purnima.
- Amavasya.
- Other regional observances.

Festival calculations must use configurable regional and religious conventions.

---

# PART 11 — NUMEROLOGY ENGINE

Create a fully independent numerology calculation subsystem.

## 11.1 Vedic Numerology

- Birth Number.
- Psychic Number.
- Destiny Number.
- Name Number.
- Compound Number.
- Friendly numbers.
- Enemy numbers.
- Neutral numbers.
- Planetary number associations.
- Lo Shu Grid.
- Missing numbers.
- Repeated numbers.
- Number combinations.
- Name correction.

## 11.2 Chaldean Numerology

- Name calculation.
- Compound number.
- Single-digit number.
- Planetary association.
- Name compatibility.
- Business name analysis.
- Brand name analysis.
- Mobile number analysis.

## 11.3 Pythagorean Numerology

- Life Path.
- Expression.
- Soul Urge.
- Personality.
- Birthday.
- Maturity.
- Pinnacles.
- Challenges.
- Personal Year.
- Personal Month.
- Personal Day.
- Master Numbers.
- Karmic Debt Numbers.

## 11.4 Numerology Tools

- Personal name analyzer.
- Baby name analyzer.
- Business name analyzer.
- Brand name analyzer.
- Mobile number analyzer.
- Vehicle number analyzer.
- House number analyzer.
- Marriage compatibility.
- Name spelling comparison.
- Lucky number analysis.
- Annual numerology forecast.

Show each calculation step and provide selectable number reduction conventions.

Do not treat Vedic, Chaldean and Pythagorean methods as interchangeable.

---

# PART 12 — WESTERN ASTROLOGY

Implement an independent tropical astrology subsystem.

- Natal chart.
- Zodiac signs.
- Planets.
- Ascendant.
- Midheaven.
- Twelve houses.
- Aspects.
- Retrogrades.
- Planetary dignities.
- Transits.
- Secondary progressions.
- Solar return.
- Lunar return.
- Synastry.
- Composite chart.
- Relationship compatibility.
- Annual forecast.

Support standard Western aspects and configurable orbs.

Never mix tropical planetary positions with sidereal interpretations without an explicit conversion.

---

# PART 13 — PREDICTIVE ASTROLOGY AND LIFE ANALYSIS

Create a unified prediction engine with separate analytical modules.

## 13.1 Life Analysis

1. Personality.
2. Character.
3. Physical appearance indicators.
4. Education.
5. Intelligence.
6. Career.
7. Profession.
8. Government employment.
9. Business.
10. Finance.
11. Wealth.
12. Property.
13. Vehicles.
14. Marriage.
15. Spouse.
16. Relationships.
17. Children.
18. Parents.
19. Siblings.
20. Foreign travel.
21. Foreign settlement.
22. Health-related traditional indicators.
23. Spirituality.
24. Karma.
25. Moksha.
26. Fame.
27. Reputation.
28. Litigation.
29. Competition.
30. Debt.

## 13.2 Prediction Methodology

For every topic evaluate the appropriate:

- Relevant Bhavas.
- Bhava lords.
- Karakas.
- Planetary strength.
- D1.
- Relevant divisional chart.
- Dasha.
- Antardasha.
- Transit.
- Ashtakavarga.
- KP significators where selected.
- Jaimini indicators where selected.

Provide:
- Positive indicators.
- Challenging indicators.
- Supporting evidence.
- Contradictory evidence.
- Relevant timing.
- Confidence assessment.
- Interpretation method.

Never convert an uncertain astrological indication into a guaranteed factual event.

---

# PART 14 — TRANSIT AND TIMING ANALYSIS

Implement:
- Daily Gochar.
- Weekly Gochar.
- Monthly Gochar.
- Annual Gochar.
- Saturn transit.
- Jupiter transit.
- Rahu-Ketu transit.
- Sade Sati.
- Ashtama Shani.
- Retrograde periods.
- Eclipse periods.
- Transit aspects.
- Transit over natal houses.
- Transit over natal planets.
- Dasha-transit correlation.
- Ashtakavarga transit analysis.

Provide a chronological timeline and date-specific chart recalculation.

---

# PART 15 — BIRTH TIME RECTIFICATION

Create an advanced rectification workspace.

Inputs:
- Birth date.
- Approximate birth time.
- Location.
- Accuracy range.
- Life-event dates.

Event categories:
- Education.
- Employment.
- Career changes.
- Marriage.
- Children.
- Relocation.
- Foreign travel.
- Property purchase.
- Major family events.

Methods:
- Ascendant transition.
- Bhava cusp transition.
- Navamsha transition.
- Dasha event matching.
- KP cuspal analysis.
- Jaimini indicators.
- Relevant transits.

Generate candidate birth times, confidence ranges and an explanation of how each candidate was evaluated.

Never claim mathematical certainty from insufficient event data.

---

# PART 16 — MATCHMAKING AND RELATIONSHIP ANALYSIS

Implement:

## Traditional Compatibility

- Ashtakoota.
- Varna.
- Vashya.
- Tara.
- Yoni.
- Graha Maitri.
- Gana.
- Bhakoot.
- Nadi.
- Guna Milan.
- Rajju.
- Vedha.
- Mahendra.
- Stree Deergha.
- Kuja Dosha.
- Manglik compatibility.

## Advanced Compatibility

- D1 comparison.
- D9 comparison.
- Seventh house.
- Seventh lord.
- Venus.
- Jupiter.
- Upapada Lagna.
- Darakaraka.
- Dasha compatibility.
- KP marriage indicators.
- Jaimini marriage indicators.

Generate:
- Individual chart reports.
- Compatibility score.
- Positive factors.
- Challenging factors.
- Detailed explanations.
- Marriage timing comparisons.

Make regional matching conventions selectable.

---

# PART 17 — PRASHNA AND MUHURTA

## 17.1 Prashna

Implement:
- Traditional Prashna.
- KP Horary.
- Horary number.
- Question timestamp.
- Location.
- Relevant houses.
- Ruling planets.
- Planetary significators.
- Event analysis.
- Timing analysis.

## 17.2 Muhurta

Support:
- Marriage.
- Engagement.
- Housewarming.
- Business launch.
- Property purchase.
- Vehicle purchase.
- Travel.
- Naming ceremony.
- Annaprashana.
- Upanayana.
- Education.
- Employment.
- Religious ceremonies.

Evaluate:
- Panchanga.
- Lagna.
- Tara Bala.
- Chandra Bala.
- Panchaka.
- Rahu Kalam.
- Yamagandam.
- Gulika Kalam.
- Dur Muhurta.
- Abhijit.
- Event-specific traditional restrictions.

Generate ranked time windows and explain why each is selected.

---

# PART 18 — GEMINI AI ASTROLOGER PLATFORM

## 18.1 AI Integration Architecture

Integrate Google Gemini API using a secure server-side service.

Allow:
- User-configured Gemini API key.
- Master-admin API configuration.
- Model selection.
- Model capability detection.
- API connection testing.
- Usage tracking.
- Request logs.
- Rate limits.
- Retry handling.
- Error reporting.
- Token usage.
- Cost monitoring where available.

Use a provider abstraction so supported Gemini models can be changed without rewriting the application.

Never expose API keys in frontend code, browser storage, public repositories or client responses.

## 18.2 AI Birth Chart Assistant

Create an intelligent AI astrologer that can understand the user's saved birth profile and actual calculated astrology data.

Example queries:

- Analyze my complete birth chart.
- Explain my Lagna.
- Explain every planet.
- Analyze my twelfth house.
- What is my strongest planet?
- Explain my Navamsha.
- Analyze my Dashamsha.
- What does my Atmakaraka indicate?
- Explain my current Mahadasha.
- Analyze my marriage prospects.
- Analyze my career.
- Explain my KP seventh cusp.
- What does my numerology indicate?
- Compare my Vedic chart with Western astrology.
- Explain my current planetary transits.
- Analyze my next five years.
- Explain the spiritual indications in my horoscope.

## 18.3 AI Context Engine

Send relevant structured data to Gemini:

- Birth details.
- Calculation settings.
- Planetary positions.
- House placements.
- Nakshatras.
- Divisional charts.
- Dasha periods.
- Yogas.
- Doshas.
- Shadbala.
- Ashtakavarga.
- KP significators.
- Jaimini Karakas.
- Numerology.
- Transits.
- Panchanga.

Retrieve only the relevant data for each question using a structured context builder.

Do not send the entire database with every request.

## 18.4 AI Response Standards

Every answer must:

1. Identify the selected astrology system.
2. Use actual calculated chart information.
3. Identify relevant planets.
4. Identify houses and lords.
5. Explain combinations.
6. Show supporting and opposing indications.
7. Correlate Dasha and transit where relevant.
8. Provide source references for classical claims when available.
9. Distinguish calculations from interpretations.
10. Explain uncertainty.
11. Avoid fabricated planetary positions.
12. Avoid fabricated classical quotations.
13. Avoid guaranteed predictions.
14. Maintain conversation context.
15. Respond in the user's preferred language.

## 18.5 Advanced AI Features

- Birth-chart chat.
- Numerology chat.
- KP astrologer.
- Parashari astrologer.
- Jaimini astrologer.
- Western astrologer.
- Panchanga assistant.
- Matchmaking assistant.
- Muhurta assistant.
- Prashna assistant.
- Sanskrit text assistant.
- Jyotisha research assistant.
- Comparative astrology assistant.
- AI report generator.
- Voice input.
- Text-to-speech.
- Conversation history.
- Saved conversations.
- Conversation search.
- PDF conversation export.

AI personas must use clearly separated system instructions and calculation conventions.

---

# PART 19 — SANATANA DHARMA RESEARCH LIBRARY

Build a structured research database containing:

## Classical Texts

- Rigveda.
- Yajurveda.
- Samaveda.
- Atharvaveda.
- Principal Upanishads.
- Vedangas.
- Brihat Parashara Hora Shastra.
- Brihat Jataka.
- Phaladeepika.
- Saravali.
- Jataka Parijata.
- Uttara Kalamrita.
- Jaimini Sutras.
- Prashna Marga.
- Muhurta Chintamani.
- Surya Siddhanta.
- Other documented classical works.

## Knowledge Categories

- Jyotisha.
- Astronomy.
- Nakshatras.
- Navagrahas.
- Rashis.
- Karma.
- Rebirth.
- Dharma.
- Artha.
- Kama.
- Moksha.
- Yoga.
- Meditation.
- Vedic philosophy.
- Upanishadic philosophy.
- Puranic knowledge.
- Shiva Tattva.
- Vishnu Tattva.
- Shakti Tattva.
- Ganesha Tattva.
- Temple traditions.
- Sacred symbolism.
- Mantras.
- Ritual traditions.
- Spiritual practices.

## Research Data Structure

Every knowledge record should contain:

- Title.
- Category.
- Original text.
- Sanskrit.
- Transliteration.
- Telugu translation.
- English translation.
- Chapter.
- Verse.
- Author or traditional attribution.
- Edition.
- Source.
- Commentary.
- References.
- Textual reliability.

Do not fabricate source attribution.

---

# PART 20 — PROFESSIONAL CHART AND DATA VISUALIZATION

Build a reusable chart-rendering engine.

## Chart Styles

- South Indian.
- North Indian.
- East Indian.
- Western circular.
- KP.
- Divisional chart grid.
- Ashtakavarga.
- Dasha timeline.

## Chart Interactions

- Select planet.
- Select house.
- Select sign.
- View degrees.
- View Nakshatra.
- View Pada.
- View lord.
- View aspects.
- Toggle planetary information.
- Toggle chart layers.
- Switch D1–D60.
- Compare two charts.
- Change chart style.
- Change calculation settings.
- Export PNG.
- Export PDF.
- Print.

All chart visualizations must use actual engine outputs.

---

# PART 21 — PROFESSIONAL REPORTING SYSTEM

Create a dedicated report-generation service.

## Report Templates

1. Complete Janma Kundali.
2. Detailed Vedic horoscope.
3. D1 analysis.
4. D9 analysis.
5. D10 career report.
6. Complete divisional chart report.
7. Vimshottari Dasha report.
8. KP horoscope report.
9. Jaimini report.
10. Marriage report.
11. Career report.
12. Wealth report.
13. Foreign settlement report.
14. Numerology report.
15. Matchmaking report.
16. Panchanga report.
17. Muhurta report.
18. Annual prediction report.
19. Birth-time rectification report.
20. Complete integrated report.

## Report Features

- Custom cover.
- User logo.
- Birth information.
- Chart images.
- Planetary tables.
- House analysis.
- Yoga analysis.
- Dasha tables.
- Detailed interpretations.
- References.
- Page numbers.
- Headers and footers.
- Telugu fonts.
- English fonts.
- PDF export.
- Print-ready layout.
- Report templates.
- Saved reports.

Reports must be generated from saved, reproducible calculation results.

---

# PART 22 — UI/UX AND APPLICATION DESIGN

Create a premium commercial software interface.

## Main Navigation

1. Dashboard.
2. Birth Profiles.
3. Horoscope.
4. Rashi Chart.
5. Bhava Chalit.
6. Divisional Charts.
7. Planetary Analysis.
8. Yogas and Doshas.
9. Dasha Systems.
10. KP Astrology.
11. Jaimini Astrology.
12. Ashtakavarga.
13. Shadbala.
14. Transits.
15. Panchangam.
16. Numerology.
17. Western Astrology.
18. Matchmaking.
19. Prashna.
20. Muhurta.
21. Birth Time Rectification.
22. AI Astrologer.
23. Knowledge Library.
24. Reports.
25. Settings.

## Dashboard Widgets

- Current birth profile.
- Ascendant.
- Moon sign.
- Nakshatra.
- Current Mahadasha.
- Current Antardasha.
- Important transits.
- Upcoming Dasha transitions.
- Today's Panchanga.
- Recent reports.
- Saved charts.
- AI chat access.
- Quick calculation shortcuts.

## Design Requirements

- Premium professional appearance.
- Responsive layout.
- Desktop-first professional workspace.
- Mobile compatibility.
- Light and dark modes.
- Telugu Unicode typography.
- Clear tables.
- Chart-focused workspace.
- Consistent design system.
- Accessible controls.
- Search and filters.
- Contextual tooltips.
- Professional empty states.
- Error handling.
- Loading states.

Avoid unnecessary decorative elements and overcrowded layouts.

---

# PART 23 — ADMINISTRATION AND COMMERCIAL FEATURES

## Master Admin

- User management.
- Role management.
- Subscription management.
- Module permissions.
- Gemini settings.
- API usage.
- Calculation engine versions.
- Knowledge library.
- Language management.
- Report templates.
- System configuration.
- Logs.
- Backups.
- Health monitoring.

## Subscription Architecture

Prepare:
- Free.
- Premium.
- Professional astrologer.
- Monthly.
- Annual.
- AI usage limits.
- Report limits.
- Profile limits.
- Feature access.
- Payment integration.
- Invoice generation.

Do not make paid subscriptions mandatory for local development or initial testing.

---

# PART 24 — TECHNICAL IMPLEMENTATION

## Recommended Stack

Frontend:
- Next.js.
- TypeScript.
- React.
- Tailwind CSS.
- Accessible component library.

Backend:
- Node.js.
- Next.js API routes or dedicated backend services.
- REST APIs.
- Background job processing.

Database:
- PostgreSQL.
- Prisma or equivalent ORM.
- Redis where required for caching and queues.

Astronomy:
- Swiss Ephemeris or licensed equivalent.
- IANA timezone database.
- Geocoding provider.

AI:
- Google Gemini API.
- Server-side provider abstraction.
- Structured prompt templates.
- Context retrieval.
- Usage monitoring.

Reports:
- PDF generation.
- Unicode font embedding.
- PNG/SVG chart exports.

Testing:
- Unit testing.
- Integration testing.
- End-to-end testing.
- Astronomical regression testing.

Deployment:
- Docker-compatible architecture.
- Environment-based configuration.
- Production database.
- Secure secrets.
- Backup and recovery.

---

# PART 25 — ENGINEERING QUALITY AND VALIDATION

## 25.1 Calculation Validation

Create golden test datasets with independently verified expected outputs.

Test:

- UTC conversion.
- Planetary positions.
- Ayanamsha.
- Ascendant.
- House cusps.
- Rashi.
- Nakshatra.
- Pada.
- Navamsha.
- All supported Vargas.
- Dasha balance.
- Antardasha.
- KP sub-lords.
- Jaimini Karakas.
- Panchanga.
- Ashtakavarga.
- Shadbala.
- Numerology.
- Compatibility.

## 25.2 Edge Cases

Test:
- Midnight births.
- Sunrise births.
- Sign-boundary births.
- Nakshatra-boundary births.
- Varga-boundary births.
- Historical time zones.
- Daylight-saving transitions.
- Leap years.
- Polar regions.
- Missing birth time.
- Uncertain birth time.
- Incomplete profiles.

## 25.3 Software Validation

Test:
- Authentication.
- User isolation.
- API security.
- Gemini connection.
- Gemini failures.
- Rate limits.
- PDF exports.
- Chart rendering.
- Profile editing.
- Data persistence.
- Mobile layout.
- Accessibility.
- Database migrations.
- Backup recovery.

## 25.4 Definition of Done

A feature is complete only when:

1. The calculation or business logic exists.
2. Its API is operational.
3. Its database integration works where required.
4. Its UI is connected to real data.
5. Input validation is implemented.
6. Error states are implemented.
7. Automated tests pass.
8. The feature has been tested end to end.

A visible interface alone does not count as implementation.

---

# PART 26 — REQUIRED PROJECT DOCUMENTATION

Create:

- README.md.
- SYSTEM_ARCHITECTURE.md.
- MODULE_SPECIFICATIONS.md.
- DATABASE_SCHEMA.md.
- ASTROLOGY_CALCULATION_METHODS.md.
- AYANAMSHA_REFERENCE.md.
- VARGA_CALCULATION_RULES.md.
- DASHA_CALCULATION_RULES.md.
- KP_CALCULATION_RULES.md.
- NUMEROLOGY_METHODS.md.
- GEMINI_INTEGRATION.md.
- API_DOCUMENTATION.md.
- TESTING_GUIDE.md.
- SECURITY_GUIDE.md.
- DEPLOYMENT_GUIDE.md.
- BACKUP_AND_RECOVERY.md.
- THIRD_PARTY_LICENSES.md.
- .env.example.

Document all calculation conventions and their sources.

---

# PART 27 — AUTONOMOUS EXECUTION PROTOCOL

You are authorized to make routine engineering and architectural decisions independently.

Do not ask me to write separate prompts for:
- Individual astrology systems.
- Individual charts.
- Numerology.
- AI integration.
- Reports.
- Database.
- Authentication.
- UI components.
- Testing.
- Deployment.

Do not stop after creating the project structure, dashboard or basic birth-chart screen.

Implement the full application using dependency-aware development.

When a dependency requires credentials, implement the integration completely and provide the exact configuration instructions.

When an external service is unavailable, implement the adapter and a clearly identified development/test mode without pretending that live results are available.

Maintain a persistent implementation checklist.

Run tests after implementing each subsystem.

Fix implementation errors before proceeding.

Preserve existing working functionality during subsequent development.

Do not remove modules to simplify the project.

If platform limits prevent completing everything in one execution, maintain a precise continuation manifest and continue from the next unfinished task without redesigning or replacing completed work.

---

# PART 28 — FINAL ACCEPTANCE REQUIREMENTS

The completed platform must provide:

- Fully operational astronomical calculation engine.
- Complete Parashari astrology.
- Traditional divisional charts.
- Multiple Dasha systems.
- KP astrology.
- Jaimini astrology.
- Ashtakavarga.
- Shadbala.
- Panchanga.
- Hindu calendar.
- Transit analysis.
- Birth-time rectification.
- Numerology.
- Western astrology.
- Marriage compatibility.
- Prashna.
- Muhurta.
- AI birth-chart assistant using Gemini.
- Sanatana Dharma knowledge library.
- Professional chart visualization.
- PDF report generation.
- Multilingual support.
- User and birth profile management.
- Administration.
- Secure API management.
- Automated tests.
- Deployment documentation.

**FINAL INSTRUCTION**

Build ASTROJYOTISH PRO as one cohesive, professional, extensible and production-oriented astrology software platform.

Prioritize mathematical correctness, classical-method transparency, reproducibility, security, usability and completeness.

Every system must use its own documented calculation rules while sharing the same validated astronomical foundation.

Do not generate fake results to make unfinished modules appear complete.

Do not declare the project finished until the acceptance tests have been executed and the actual implementation status has been documented.

Deliver the complete application, not merely a design, mockup, prototype or MVP.