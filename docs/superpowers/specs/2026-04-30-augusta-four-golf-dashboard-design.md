# The Augusta Four — Golf Dashboard

**Date:** 2026-04-30
**Status:** Approved (brainstorming complete)
**Source brief:** `Claude Code Master Brief: The Augusta Four — Golf Dashboard` (provided by user, contained in conversation context)

---

## Overview

A read-only public web dashboard for four friends tracking a 4-round golf competition modelled on The Masters. The app displays leaderboard, scorecards, hole-by-hole results, player stats, and commentary across 4 rounds (Day 1 to Day 4). All score and commentary updates flow through Claude Code sessions — there is no admin UI, no authentication, no input flow.

## Goals

1. A public URL that displays the current state of the tournament — leaderboard, scorecards, commentary — at any time
2. A frictionless update workflow: developer shares scorecard screenshots in a Claude Code session, Claude Code edits the data and commentary, `git push`, Vercel auto-deploys
3. Mobile-first experience optimised for ~390px viewports — the four players will check the dashboard on phones
4. Visual aesthetic that borrows Golfy's restraint and card-based layout while leaning into a darker, more dramatic Masters-inspired palette

## Non-Goals

- No login, no authentication, no protected routes
- No admin UI, no in-app score entry, no file upload
- No real-time multi-client sync
- No handicap tracking, no multiple courses
- No animations beyond subtle Tailwind transitions (theme toggle, tab switch)
- No social sharing, no notifications
- No backend services beyond static hosting

## Architectural Decisions (deviations from original brief)

The original brief specified Firebase Firestore for storage and the Anthropic API for commentary generation. During brainstorming we replaced both:

| Original brief | Decision | Reason |
|---|---|---|
| Firebase Firestore for data | **Static TypeScript data modules in repo** | The four-person, single-source-of-truth, read-only pattern doesn't need real-time sync. Static modules give type safety, version history via git, and zero credential management. Update workflow becomes "Claude Code edits a file → git push → Vercel auto-deploys (~30s)" — functionally identical to "live from Firestore" for this use case. |
| Anthropic API for commentary generation | **Commentary written in-session by Claude Code as static strings** | The developer is always present (in a Claude Code session) when scores are updated. Drafting commentary in-session and writing it as static text into the data file is simpler, removes API key management, and gives the developer a chance to review tone before commit. |
| `ANTHROPIC_API_KEY` env var | **Removed entirely** | Not needed. |
| All Firebase env vars | **Removed entirely** | Not needed. |

These decisions remove an entire category of setup, credentials, security rules, and ongoing complexity for zero functional loss against the brief's actual requirements.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, dark mode via `class` strategy |
| Data | Typed TypeScript modules in `data/` |
| Auth | None |
| External APIs | None |
| Hosting | Vercel (auto-deploy on `git push`) |
| Source control | GitHub |

## Architecture

### Data layer — `data/`

Single source of truth for all tournament data. Edited by Claude Code during update sessions.

```
data/
  types.ts        // Player, Hole, Scorecard, Round, Commentary types (mirrors brief's Firestore shapes)
  players.ts      // PLAYERS: 4 entries with id, displayName, username, flag
  course.ts       // HOLE_PARS[18], FRONT_9_PAR=36, BACK_9_PAR=36, TOTAL_PAR=72
  rounds.ts       // ROUNDS: 4 entries + SEASON_COMMENTARY top-level export
```

#### Type definitions

The `Hole` type stores only raw input — `result` is **never stored**, always computed via `lib/scoreUtils.ts → computeResult(strokes, par)`. This eliminates duplicate-source-of-truth risk between stored result and stroke math.

```ts
type PlayerId = "sam" | "josh" | "jamie" | "keo"

type ResultClass =
  | "eagle_or_better"
  | "birdie"
  | "par"
  | "bogey"
  | "double_bogey_plus"

type Hole = {
  holeNumber: number     // 1–18
  par: number
  strokes: number | null // null if not yet played
}

type Scorecard = {
  holes: Hole[]          // exactly 18
  // Round-level totals stored explicitly so Claude Code can be deliberate about partial vs complete state.
  // Keep these in sync with holes when editing — derivable but stored for clarity.
  front9Strokes: number | null
  front9ToPar:   number | null
  back9Strokes:  number | null
  back9ToPar:    number | null
  totalStrokes:  number | null
  totalToPar:    number | null
}

type RoundCommentary = {
  players: Partial<Record<PlayerId, string>>  // missing keys render no card
  summary: string | null                       // round_summary, null if not yet written
}

type Round = {
  id: string                          // "round_1" .. "round_4"
  roundNumber: 1 | 2 | 3 | 4
  label: string                       // "Day 1" .. "Day 4"
  status: "in_progress" | "complete"
  scorecards: Record<PlayerId, Scorecard>
  commentary: RoundCommentary
}
```

#### `rounds.ts` exports

```ts
export const ROUNDS: Round[] = [ /* round_1 (Day 1) seeded; round_2-4 fully stubbed with null strokes */ ]

// Season commentary is a single string updated each time scores are added.
// Top-level export — does NOT live inside any individual round.
export const SEASON_COMMENTARY: string | null = "..."  // null until written
```

### Derived layer — `lib/`

Pure functions that compute derived state on render. Nothing is stored — derived data cannot drift from source.

```
lib/
  scoreUtils.ts    // computeResult(strokes, par): ResultClass | null  (null when strokes is null)
                   // formatToPar(n): "-4" | "+2" | "E" | "—"
                   // resultBgClass(result): Tailwind/CSS class names for cell background
                   // resultIcon(result): JSX-friendly icon descriptor

  leaderboard.ts   // computeLeaderboard(rounds): LeaderboardRow[]
  holeWinners.ts   // computeHoleWinner(roundId, holeNumber): PlayerId | "tie" | null
  playerStats.ts   // computePlayerStats(playerId, rounds): PlayerStats
```

#### `computeLeaderboard` rules

For each player, computes `r1ToPar`, `r2ToPar`, `r3ToPar`, `r4ToPar`, and `totalToPar`:

- A round contributes its `totalToPar` if the round's `status === "complete"`. Otherwise it contributes the **running** to-par across whichever holes have non-null strokes (computed on the fly: sum of strokes − sum of pars across played holes). For Day 1 front 9 only, this means R1 displays `-4` for Sam, `-2` for Josh and Keo, `-1` for Jamie.
- If a player has zero non-null holes in a round, the round column renders `—` and contributes 0 to the running total.
- `totalToPar` is the sum of all played-hole contributions across all 4 rounds.

Sort order:
1. Primary: ascending by `totalToPar` (lower is better — under par wins)
2. Tie-break: stable order from the `PLAYERS` array (Sam → Josh → Jamie → Keo)
3. Position display: tied players share `T` prefix — e.g. Josh and Keo both at -2 render as `T2`, with the next non-tied player at position 4 (standard golf scoring convention).

#### `computeHoleWinner` rules

Given a `roundId` and `holeNumber`:
- If any of the 4 players has `strokes === null` for that hole → return `null` (not enough data)
- If exactly one player has the lowest stroke count → return that `PlayerId`
- If two or more players tie for the lowest → return `"tie"`

#### `computePlayerStats` null-handling rules

For a given player across all rounds:

| Field | Definition | Null-handling |
|---|---|---|
| `eagles` | count of holes where `strokes <= par - 2` | skip null-stroke holes |
| `birdies` | count of holes where `strokes === par - 1` | skip null-stroke holes |
| `pars` | count of holes where `strokes === par` | skip null-stroke holes |
| `bogeys` | count of holes where `strokes === par + 1` | skip null-stroke holes |
| `doubleBogeyPlus` | count of holes where `strokes >= par + 2` | skip null-stroke holes |
| `holesWon` | count of holes where `computeHoleWinner` returns this player's id | only counts holes with a determined winner |
| `holesLost` | count of holes where another player had the lowest score and this player did not tie for it | only counts holes with a determined winner |
| `holesTied` | count of holes where `computeHoleWinner` returns `"tie"` AND this player was among the tied lowest | only counts holes with a determined winner |
| `bestRound` | lowest `totalToPar` across rounds where `status === "complete"` | returns `null` if no round is complete |
| `scoringAverage` | sum of all non-null strokes / count of non-null holes | returns `null` if no holes played |

### Page & component structure — `app/` and `components/`

```
app/
  layout.tsx      // <html> wrapper, dark mode class init from localStorage (inline script to avoid FOUC)
  page.tsx        // The dashboard. Owns selectedRound and statsOpen state.
  globals.css     // Tailwind base layer + CSS variable definitions for both themes

components/
  Header.tsx                      // App name (Augusta Four / similar) + ThemeToggle
  ThemeToggle.tsx                 // Icon-only sun/moon, toggles `dark` class on <html>, persists to localStorage
  Leaderboard.tsx                 // Masters-style table: POS | PLAYER | R1 | R2 | R3 | R4 | TOTAL
  SeasonCommentary.tsx            // Full-width card with season_master commentary text
  RoundTabs.tsx                   // Day 1 / Day 2 / Day 3 / Day 4 — controlled by parent
  RoundDetail.tsx                 // Container for a single round's content
    Scorecard.tsx                 // The grid: Hole | 1..9 | OUT | 10..18 | IN | TOT (horizontally scrollable)
    PlayerCommentaryCards.tsx     // Stack of 4 player_round commentary cards
    RoundSummaryCard.tsx          // round_summary commentary card
  StatsPanel.tsx                  // Toggle button + collapsible grid of 4 player stat cards
```

### Mobile page order (top → bottom)

1. Header (with theme toggle)
2. Leaderboard
3. Season commentary
4. Round tabs (not sticky — natural scroll)
5. Round detail: Scorecard → Player commentary cards → Round summary card
6. Stats panel (toggle button → collapsible grid)

### State

Kept minimal. All in `app/page.tsx`:

- `selectedRound: 1 | 2 | 3 | 4` — controls RoundTabs and which round RoundDetail shows
- `statsOpen: boolean` — controls StatsPanel visibility

Theme state is not React state — it's a `dark` class on `<html>`, managed by ThemeToggle and persisted to localStorage. An inline script in `layout.tsx` reads localStorage and sets the class before first paint to avoid FOUC.

## Design System

### Colours (from brief)

**Dark mode (default):**

```css
--bg-primary:    #1a2a1a;
--bg-surface:    #243324;
--bg-elevated:   #2d3f2d;
--accent:        #d4a843;
--text-primary:  #ffffff;
--text-muted:    #8aaa8a;
--score-under:   #e84040;
--score-over:    #888888;
--score-eagle:   #d4a843;
--hole-winner:   #2a5c2a;
--border:        #3a5c3a;
```

**Light mode:**

```css
--bg-primary:    #f5f0e8;
--bg-surface:    #ffffff;
--bg-elevated:   #f0ebe0;
--accent:        #d4a843;
--text-primary:  #1a1a1a;
--text-muted:    #666666;
--score-under:   #cc0000;
--score-over:    #555555;
--score-eagle:   #b8860b;
--hole-winner:   #d4f0d4;
--border:        #d0c8b8;
```

### Typography

- Headings: serif (Georgia or similar) for Masters feel
- Body: system-ui / sans-serif
- Scores: `font-variant-numeric: tabular-nums` (or monospace) so columns align

### Visual direction

Borrowed from Golfy:
- Card-based layout with rounded corners and generous internal padding
- Bold large numerics for hero stats, smaller muted labels above
- Restrained colour usage — accents as category signals, not decoration
- Aggressive use of whitespace

Differs from Golfy:
- Darker palette by default (deep Augusta green vs cream)
- No personal greeting or to-do widgets — this is a scoreboard
- Slightly more drama in leaderboard treatment (serif type, gold accents)

### Scorecard cell styling rules

Per-cell visual treatment based on result:

| Result | Background | Icon |
|---|---|---|
| Eagle or better (`strokes <= par - 2`) | gold (`--score-eagle`) | double-circle |
| Birdie (`strokes === par - 1`) | red (`--score-under`) | single circle |
| Par | default | none |
| Bogey (`strokes === par + 1`) | light grey | square outline |
| Double bogey+ (`strokes >= par + 2`) | darker grey | double square outline |

Hole winner: when `computeHoleWinner` returns a player id (not `null`, not `"tie"`), apply `--hole-winner` background to that player's cell for that hole. When it returns `"tie"`, apply the highlight to all tied cells with a small "T" indicator. When `null` (one or more players missing scores), no highlight on any cell — confirmed during brainstorming as decision A.

Null strokes render as `—`.

## Update Workflow (post-launch)

When new scorecard data arrives:

1. Developer starts a new Claude Code session, attaches scorecard screenshots
2. Claude Code reads scores from the images
3. Claude Code edits `data/rounds.ts` directly (Edit tool), updating:
   - Player hole `strokes` values (result classes are computed, never stored)
   - Round-level totals (front9, back9, total) — kept in sync with hole strokes
   - Round status (`in_progress` → `complete` when all 18 holes have non-null strokes for all 4 players)
4. Claude Code drafts commentary in the conversation using the tone prompt from the brief, then writes the strings into the same `rounds.ts` file
5. `git add . && git commit -m "..." && git push`
6. Vercel auto-deploys (~30 seconds)
7. Dashboard reflects new data

No build step required. No script invocations required. The dashboard is always live.

### Tone prompt for commentary (verbatim from brief)

```
You are a brutally honest, hilariously savage golf commentator writing
for a WhatsApp group of four mates who play EA Sports golf together.
You have no filter, no mercy, and a gift for finding the most
embarrassing detail in any scoreline. Roast individuals by name.
Call out chokes, flukes, and suspiciously good putting. The funnier
and more cutting, the better. Write like you know these blokes
personally. Do not be polite. Do not hedge. Do not be kind.
```

### Commentary lengths

- `player_round` (one per player per round): ~150 words
- `round_summary` (one per round): ~200 words
- `season_master` (one per latest round update): ~200 words

## Initial Build Sequence

| # | Step |
|---|---|
| 1 | Scaffold Next.js 14 + TypeScript + Tailwind via `create-next-app`, App Router, dark mode `class` strategy |
| 2 | Build out `data/` and `lib/` modules with full types and seed data |
| 3 | Set up design system: CSS variables in `globals.css`, Tailwind config tweaks |
| 4 | Build Header + ThemeToggle, verify persistence |
| 5 | Build Leaderboard (validates data layer end-to-end) |
| 6 | Build Scorecard grid (most complex — get this right before commentary) |
| 7 | Build RoundTabs + RoundDetail container |
| 8 | Build PlayerCommentaryCards, RoundSummaryCard, SeasonCommentary |
| 9 | Build StatsPanel |
| 10 | Mobile QA pass at ~390px |
| 11 | Draft Day 1 front 9 commentary in-session, embed in `data/rounds.ts` |
| 12 | `gh repo create` walkthrough |
| 13 | Vercel connection walkthrough |

## Seed Data — Day 1 Front 9

Only `Strokes` is stored. The `Result` row below is shown for verification only — it is computed at render time by `computeResult(strokes, par)`.

**Sam Clifford** — front9Strokes 32, front9ToPar -4

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Par | 4 | 5 | 4 | 3 | 4 | 3 | 4 | 5 | 4 |
| Strokes | 4 | 3 | 3 | 2 | 3 | 3 | 4 | 5 | 5 |
| Result (computed) | par | eagle_or_better | birdie | birdie | birdie | par | par | par | bogey |

**Hames Keo** — front9Strokes 34, front9ToPar -2

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Strokes | 6 | 3 | 3 | 4 | 3 | 3 | 5 | 4 | 3 |
| Result (computed) | double_bogey_plus | eagle_or_better | birdie | bogey | birdie | par | bogey | birdie | birdie |

**Jamie Maclaren** — front9Strokes 35, front9ToPar -1

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Strokes | 4 | 4 | 4 | 3 | 4 | 3 | 4 | 5 | 4 |
| Result (computed) | par | birdie | par | par | par | par | par | par | par |

**Josh Dally** — `front9Strokes: 34` (inferred), `front9ToPar: -2` (confirmed leaderboard total). Hole-by-hole `strokes` are all `null`. `computeResult` returns `null` for each.

For all 4 players, `back9Strokes`, `back9ToPar`, `totalStrokes`, and `totalToPar` are `null` for Day 1 (back 9 not played).

Hole-by-hole winners for Day 1 holes 1–9: all `null` (Josh's per-hole scores not available, so `computeHoleWinner` cannot determine a winner per its rules).

Rounds 2–4: every player's scorecard has all 18 holes with `strokes: null`, all round-level totals `null`, status `"in_progress"`, commentary empty (`{ players: {}, summary: null }`).

## Players (from brief)

```ts
const PLAYERS = [
  { id: "sam",   displayName: "Sam Clifford",  username: "Sam854",      flag: "🇬🇧" },
  { id: "josh",  displayName: "Josh Dally",    username: "joshdally",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "jamie", displayName: "Jamie Maclaren", username: "umie51",      flag: "🇦🇺" },
  { id: "keo",   displayName: "Hames Keo",     username: "JamesKeo126", flag: "🇬🇱" },
]
```

## Augusta National Hole Pars (from brief)

```ts
const HOLE_PARS = [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4]
// FRONT_9_PAR = 36, BACK_9_PAR = 36, TOTAL_PAR = 72
```

## Success Criteria

- [ ] Dashboard renders cleanly at `localhost:3000` with the actual launch data state: Day 1 front 9 scores partially populated (Josh's per-hole strokes null), Days 2–4 fully empty. No crashes, no empty-state errors, no NaNs.
- [ ] Leaderboard for Day 1 displays positions in this order: `1` Sam (-4), `T2` Josh (-2), `T2` Keo (-2), `4` Jamie (-1). Ties share the `T` prefix; tie-break order between Josh and Keo follows the `PLAYERS` array (Josh first).
- [ ] Leaderboard `R1` column shows running to-par across played holes for each player (-4, -2, -2, -1). `R2`/`R3`/`R4` columns render `—`. `TOTAL` matches `R1`.
- [ ] Scorecard for Day 1 displays correct hole-by-hole strokes for Sam, Jamie, Keo; `—` for all of Josh's hole cells; result-class background and icon applied correctly to each cell with strokes.
- [ ] At least one commentary card renders if commentary text is present; missing player commentary keys render no card (no empty card placeholders).
- [ ] Theme toggle switches between dark and light modes and persists across page reloads via `localStorage`. No FOUC on initial load.
- [ ] Scorecard scrolls horizontally on a 390px viewport without squashing or reformatting; vertical layout is uncluttered.
- [ ] Hole-winner highlight is absent on all Day 1 front 9 cells (Josh's data missing, so `computeHoleWinner` returns `null` for each).
- [ ] Stats panel toggle reveals computed stats for all 4 players. `bestRound` and `scoringAverage` for Josh render `—` (no completed round, no non-null strokes); other players show partial stats from their played holes.
- [ ] Public Vercel URL loads with no login required.

## Open Questions / Deferred

- Sticky tab navigation: deferred. Not sticky for now per brainstorming. Revisit only if scrolling proves disruptive in mobile QA.
- Stats panel layout (toggle button vs per-player accordion): single toggle button decided.
- Refinements to visual treatment, spacing, typography choices: deferred to "build then tweak" pass after first deploy.

## Out of Scope (explicit)

The following are listed to prevent scope creep — none are part of this build:

- Login / authentication
- File upload UI
- In-app score entry
- Admin panel
- Push notifications
- Social sharing
- Handicap tracking
- Multiple courses
- Animations beyond Tailwind transitions on theme/tab changes
