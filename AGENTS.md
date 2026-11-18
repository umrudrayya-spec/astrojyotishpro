<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules (AstroJyotish Pro)

- Read `chat.md` first; it is the central project memory and status file. Update it after every task.
- All astronomy comes from Swiss Ephemeris via `@swisseph/browser` (WASM) in `src/lib/astro/ephemeris.ts`, run in the browser; AI and UI code never compute or invent positions. Why: deterministic, reproducible, and the Worker runtime stays free of native code.
- Sidereal house cusps = tropical `swe_houses` cusps minus the ayanamsha (the WASM build has no sidereal houses flag). Why: keeps one consistent zodiac for planets and cusps.
- Engine modules are layered: `constants.ts` (classical tables) → `ephemeris.ts` (raw positions) → `parashari.ts` (rule-based analysis) → UI. Each further system (vargas, dashas, bhava rules, KP, Jaimini…) gets its own module in `src/lib/astro/` with its own test file, consuming longitudes/`RawChart` only. Why: independently testable engines per spec.
- Where schools disagree (ayanamsha, node type, node aspects, house system), expose a setting in `src/lib/astro/settings.ts`; never silently pick one. Why: spec §31.
- Every computed chart carries `meta` (engine version, ephemeris source, settings, algorithm version); bump `ALGORITHM_VERSION` when calculation logic changes. Why: reproducibility.
- Birth profiles store the UTC offset resolved at save time from IANA historical rules (`src/lib/astro/time.ts`); charts use the stored offset. Why: results stay reproducible if tz data changes.
- All UI strings go through the typed dictionary in `src/lib/i18n.tsx` (`t(key)`); Telugu is the default language. Why: every screen must switch language without data loss.
- Ephemeris tests run in the node vitest environment with a fetch stub that reads the local `.wasm` file. Why: the WASM loader uses fetch.
- No AI-generated images; visuals are SVG/Tailwind/Lucide only. Why: user requirement.
- `docs/AUDIT.md` is the feature inventory (status per feature in this app vs the reference HTML tool in `docs/reference/`); update its status column when a feature lands. Why: spec v3 requires a maintained implementation inventory.

- Navigation sections live in `src/lib/nav.ts` (spec v3 §2.1); a section gets a `to` only when its route exists, otherwise it is listed as "Soon" and is not a link. Why: no fake or disconnected navigation (spec v3 §0).
