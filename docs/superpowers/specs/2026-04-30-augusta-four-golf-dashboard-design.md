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
  rounds.ts       // ROUNDS: 4 entries — round metadata + scorecards (per player) + commentary
```

`rounds.ts` shape (one consolidated array):

```ts
export const ROUNDS: Round[] = [
  {
    id: "round_1",
    roundNumber: 1,
    label: "Day 1",
    status: "in_progress",
    scorecards: {
      sam:   { holes: [...], front9Strokes, front9ToPar, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
      josh:  { holes: [...], ... },
      jamie: { holes: [...], ... },
      keo:   { holes: [...], ... },
    },
    commentary: {
      players: { sam: "...", josh: "...", jamie: "...", keo: "..." },
      summary: "...",
      season: "..."   // season-level commentary lives on the most recent round, or extracted to a top-level field
    }
  },
  // round_2, round_3, round_4 — fully stubbed with null strokes/results
]
```

### Derived layer — `lib/`

Pure functions that compute derived state on render. Nothing is stored — derived data cannot drift from source.

```
lib/
  leaderboard.ts   // computeLeaderboard(rounds): rows sorted by total to par
  holeWinners.ts   // computeHoleWinner(roundId, holeNumber): "sam" | "josh" | "jamie" | "keo" | "tie" | null
                   //   returns null when any of the 4 players has a null score for that hole
  playerStats.ts   // computePlayerStats(playerId, rounds): { eagles, birdies, pars, bogeys, doubleBogeyPlus,
                   //   holesWon, holesLost, holesTied, bestRound, scoringAverage }
  scoreUtils.ts    // formatToPar(n): "-4" | "+2" | "E" | "—"
                   // resultClass(result): Tailwind class names for cell styling
```

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
   - Player hole scores and result classifications
   - Round-level totals (front9, back9, total)
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

From the brief (totals computed from hole scores):

**Sam Clifford** — front9Strokes 32, front9ToPar -4

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Par | 4 | 5 | 4 | 3 | 4 | 3 | 4 | 5 | 4 |
| Strokes | 4 | 3 | 3 | 2 | 3 | 3 | 4 | 5 | 5 |
| Result | par | eagle+ | birdie | birdie | birdie | par | par | par | bogey |

**Hames Keo** — front9Strokes 34, front9ToPar -2

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Strokes | 6 | 3 | 3 | 4 | 3 | 3 | 5 | 4 | 3 |
| Result | dbogey+ | eagle+ | birdie | bogey | birdie | par | bogey | birdie | birdie |

**Jamie Maclaren** — front9Strokes 35, front9ToPar -1

| Hole | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Strokes | 4 | 4 | 4 | 3 | 4 | 3 | 4 | 5 | 4 |
| Result | par | birdie | par | par | par | par | par | par | par |

**Josh Dally** — front9Strokes 34 (inferred), front9ToPar -2 (confirmed leaderboard total). Hole-by-hole strokes are `null`, results are `null`.

Hole-by-hole winners for Day 1 holes 1–9: all `null` (Josh's per-hole scores not available).

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

- [ ] Dashboard renders at `localhost:3000` showing Day 1 front 9 data
- [ ] Leaderboard shows Sam (-4), Josh (-2), Keo (-2), Jamie (-1) for Day 1 (with appropriate tie ordering)
- [ ] Scorecard for Day 1 displays correct hole-by-hole strokes for Sam, Jamie, Keo; "—" for Josh's holes
- [ ] All 4 player commentary cards render (Josh's may be short or note that hole-by-hole detail is missing)
- [ ] Theme toggle works and persists across page reloads
- [ ] Scorecard scrolls horizontally on a 390px viewport without squashing or reformatting
- [ ] Hole winner highlight applied correctly when all 4 players have data; absent when any player is missing data
- [ ] Stats panel toggle reveals computed stats for all 4 players
- [ ] Public Vercel URL loads with no login required

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
