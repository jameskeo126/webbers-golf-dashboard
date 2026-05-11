import type { Round, Scorecard, Hole, PlayerId } from "./types"
import { HOLE_PARS } from "./course"

// Helpers for building scorecards. Used here, not exported.
function emptyHoles(): Hole[] {
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: null }))
}
function holesFromStrokes(strokes: (number | null)[]): Hole[] {
  if (strokes.length !== 18) throw new Error("expected 18 holes")
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: strokes[i] }))
}
function emptyScorecard(): Scorecard {
  return {
    holes: emptyHoles(),
    front9Strokes: null, front9ToPar: null,
    back9Strokes:  null, back9ToPar:  null,
    totalStrokes:  null, totalToPar:  null,
  }
}

// Day 1 — complete.
// Sam: front 4,3,3,2,3,3,4,5,5 (32, -4) + back 3,4,3,4,3,4,2,3,4 (30, -6) = 62, -10
const sam_r1 = holesFromStrokes([4,3,3,2,3,3,4,5,5,  3,4,3,4,3,4,2,3,4])
// Keo: front 6,3,3,4,3,3,5,4,3 (34, -2) + back 4,3,3,5,3,4,2,4,3 (31, -5) = 65, -7
const keo_r1 = holesFromStrokes([6,3,3,4,3,3,5,4,3,  4,3,3,5,3,4,2,4,3])
// Jamie: front 4,4,4,3,4,3,4,5,4 (35, -1) + back 4,3,2,3,3,3,3,4,5 (30, -6) = 65, -7
const jamie_r1 = holesFromStrokes([4,4,4,3,4,3,4,5,4, 4,3,2,3,3,3,3,4,5])
// Josh: front 9 per-hole still unknown (front9ToPar -2, 34 strokes inferred).
// Back 9 confirmed: 4,3,2,5,3,4,3,3,4 (31, -5). Total: 34 + 31 = 65, -7.
const josh_r1 = holesFromStrokes([null,null,null,null,null,null,null,null,null,  4,3,2,5,3,4,3,3,4])

const r1Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r1,   front9Strokes: 32, front9ToPar: -4, back9Strokes: 30, back9ToPar: -6, totalStrokes: 62, totalToPar: -10 },
  josh:  { holes: josh_r1,  front9Strokes: 34, front9ToPar: -2, back9Strokes: 31, back9ToPar: -5, totalStrokes: 65, totalToPar: -7 },
  jamie: { holes: jamie_r1, front9Strokes: 35, front9ToPar: -1, back9Strokes: 30, back9ToPar: -6, totalStrokes: 65, totalToPar: -7 },
  keo:   { holes: keo_r1,   front9Strokes: 34, front9ToPar: -2, back9Strokes: 31, back9ToPar: -5, totalStrokes: 65, totalToPar: -7 },
}

// Day 2 — complete.
// Sam: front 4,4,4,3,4,2,3,5,3 (32, -4) + back 4,3,3,3,3,4,3,3,3 (29, -7) = 61, -11
const sam_r2 = holesFromStrokes([4,4,4,3,4,2,3,5,3,  4,3,3,3,3,4,3,3,3])
// Keo: front 5,3,3,3,3,3,3,4,3 (30, -6) + back 3,4,3,4,3,4,3,3,4 (31, -5) = 61, -11
const keo_r2 = holesFromStrokes([5,3,3,3,3,3,3,4,3,  3,4,3,4,3,4,3,3,4])
// Jamie: front 3,4,4,3,3,2,5,4,3 (31, -5) + back 4,3,2,4,3,3,3,3,5 (30, -6) = 61, -11
const jamie_r2 = holesFromStrokes([3,4,4,3,3,2,5,4,3, 4,3,2,4,3,3,3,3,5])
// Josh: front 4,3,3,4,4,2,3,4,4 (31, -5) + back 3,4,4,4,3,4,3,3,3 (31, -5) = 62, -10
const josh_r2 = holesFromStrokes([4,3,3,4,4,2,3,4,4, 3,4,4,4,3,4,3,3,3])

const r2Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r2,   front9Strokes: 32, front9ToPar: -4, back9Strokes: 29, back9ToPar: -7, totalStrokes: 61, totalToPar: -11 },
  josh:  { holes: josh_r2,  front9Strokes: 31, front9ToPar: -5, back9Strokes: 31, back9ToPar: -5, totalStrokes: 62, totalToPar: -10 },
  jamie: { holes: jamie_r2, front9Strokes: 31, front9ToPar: -5, back9Strokes: 30, back9ToPar: -6, totalStrokes: 61, totalToPar: -11 },
  keo:   { holes: keo_r2,   front9Strokes: 30, front9ToPar: -6, back9Strokes: 31, back9ToPar: -5, totalStrokes: 61, totalToPar: -11 },
}

function emptyRound(roundNumber: 1 | 2 | 3 | 4, label: string): Round {
  return {
    id: `round_${roundNumber}`,
    roundNumber,
    label,
    status: "in_progress",
    scorecards: { sam: emptyScorecard(), josh: emptyScorecard(), jamie: emptyScorecard(), keo: emptyScorecard() },
    commentary: { players: {}, summary: null },
  }
}

export const ROUNDS: Round[] = [
  {
    id: "round_1",
    roundNumber: 1,
    label: "Day 1",
    status: "complete",
    scorecards: r1Scorecards,
    commentary: {
      players: {
        sam: `Sam shot a 62. Sixty-two. Across all 18 holes of Augusta National. The rest of us are sitting here re-reading the leaderboard like it's a typo.

Front 9 was already an offence: -4 with the eagle on hole 2 and a three-birdie run across 3, 4 and 5. Closed with a bogey on 9, briefly suggesting humanity. Then on the back 9 he proceeded to put a birdie on basically every other hole — 10, 13, 14, 15, 16, 17. Six birdies on nine holes. Three pars. No bogeys. 30 strokes for the back nine.

Sam Clifford is -10 through one round. The rest of us are tied at -7, three strokes back, looking for the controller's reset button. The only way back into this tournament is a Sam Clifford mid-round nervous breakdown. We will be watching for one.`,

        josh: `Josh, mate. Josh. The back 9 came in. WITH PER-HOLE NUMBERS. At last.

5 birdies — holes 11, 12, 14, 15, 17 — and 4 pars. -5 on the back. 31 strokes. Not a single hole over par. We see you. We have written it down. The audit is, for now, paused.

But the front 9 of Day 1 remains a blank space. -2 with no per-hole story. Josh sits at -7 for the day, tied for second, and we still don't know how he opened. Day 2 had better arrive with a complete card or the audit comes back from suspension and the proceedings will be PUBLIC. Day 1: -7. Most of the data, eventually tabled.`,

        jamie: `Jamie has been deceiving us this entire time.

Front 9 was the bait. 8 pars, 1 birdie, the most boring nine holes in golf. We called him a metronome. We mocked him for treating Augusta like a spreadsheet. We were WRONG. We were SET UP.

Back 9: two eagles. TWO. Hole 13 (par 5, three on the card). Hole 15 (par 5, three on the card). Three more birdies. One par. A bogey on 18 to keep the ledger honest. 30 strokes for -6 on the back. He went round Amen Corner like he was filing it for tax purposes — calmly, ruthlessly, with no expression on his face.

Tied second at -7. Jamie Maclaren has been quietly murderous and we hereby apologise for ever using the word 'metronome'. Sam still has a three-stroke lead. But Jamie just put the leader on notice.`,

        keo: `Keo's back 9 was the most upsetting thing about today.

It was — and this is hard to type — disciplined. Five birdies (holes 11, 14, 15, 16, 18). Four pars. ZERO bogeys. ZERO disasters. ZERO double-bogeys. 31 strokes. -5 on the back.

The man who opened the day with a six on hole one and an eagle on hole two has finished the day with what can only be described as 'a real round of golf'. Like an actual functioning competitive golfer. JamesKeo126 is tied second at -7. We are deeply concerned. The chaos was a feature, not a bug. Day 2 had better contain at least one car-crash hole or we are filing a missing persons report for the Keo we knew.`,
      },
      summary: `Day 1 is done and Sam Clifford has put down a marker that should make the rest of us feel embarrassed for showing up. A 62. -10. Bogey-free on the back nine with six birdies across nine holes. He's three clear of a three-way tie at -7.

In the second-place chase: Josh "I will file numbers when it suits me" Dally finally turned in a back-9 per-hole card (-5), Jamie Maclaren had a two-eagle psychotic episode after pretending to be boring all morning, and Keo posted the most boring back 9 of his career — five birdies, four pars, zero chaos.

Three strokes is gettable in three days. Three strokes from Sam, when Sam is shooting -10, is something else entirely. The chasing pack needs a wobble. Day 2 begins tomorrow.`,
    },
  },
  {
    id: "round_2",
    roundNumber: 2,
    label: "Day 2",
    status: "complete",
    scorecards: r2Scorecards,
    commentary: {
      players: {
        sam: `Sam Clifford shot a SIXTY-ONE on Day 2. To follow up the SIXTY-TWO from Day 1. Across 36 holes at Augusta National he is now -21. One bogey total in the entire tournament so far.

The front 9 today was a flat -4, which had the rest of us briefly believing the gap was closing. Then Sam went out and shot a 29 on the back. Eagle on hole 13. Birdies on 11, 14, 15, 17 and 18. Three pars, no bogeys. Twenty-nine strokes, the lowest back 9 of the tournament by anyone so far.

-21 for the season, three strokes clear of Jamie and Keo (T2 at -18). The wobble was a feint. Sam responded to the entire chasing pack catching up to within a stroke by shooting the lowest back 9 we have on record. The man is a monster.`,

        josh: `Josh's back 9 was -5: six birdies (10, 13, 14, 15, 17 and 18), two pars, and one bogey on hole 12 — a four on a par 3, which is a special kind of inefficiency.

The defining Josh moment of the night came after he hit a shot that didn't quite shape the way he wanted. "I thought it would come back but it didn't," he says, dead serious. Sam, without looking up: "Just like your hairline." Josh has not recovered. Neither have we. The transplant lobby has filed a complaint.

62 for the day, -17 for the tournament. Sole 4th place, one stroke off the T2 pack. Sam shot a 61 on top of the 62 he shot yesterday. Four strokes back, two rounds to go. The chase is, charitably, uphill.`,

        jamie: `Jamie shot a sixty-one. Same number Sam shot. Same number Keo shot. Three players, three 61s, no one closed any ground on the leader at all.

The back 9 was the work of someone who has obviously been studying the leader. Five birdies (11, 12, 14, 17), an eagle on hole 15 (yes — same hole he eagled yesterday, par 5, three on the card both times), two pars, and a closing bogey on 18 because he has to remind us he's human.

Special mention to the moment Jamie took it upon himself to coach Sam — the tournament leader, the man shooting a 29 on the back nine — on how to shape his putts. Long explanation, hands waving, full instructor mode. Then he stepped up to his own putt — the easiest putt of the night, conceded territory — and missed it. The silence was a public service.

Day 2 total: -11. Season: -18, tied second with Keo. One day ago we called Jamie a metronome. We have been bleeding since. If this Jamie shows up tomorrow — and keeps his mouth shut on the green — the leader's three-stroke margin is in real danger.`,

        keo: `Keo. Look at Keo. The man who opened the tournament with a six on hole one has now shot a 61.

Five birdies (10, 13, 14, 15, 17), four pars, ZERO bogeys on Day 2's back 9. Combined with the front 9 (-6, including the bogey-then-eagle on holes 1 and 2), he shot a 61 today. Same number as Sam. Same number as Jamie.

JamesKeo126 is -18 for the tournament, tied second with Jamie. Two consecutive disciplined back 9s (Day 1: 5 birdies + 4 pars + 0 bogeys; Day 2: 5 birdies + 4 pars + 0 bogeys, again). The chaos era is, formally, over. The man is playing actual real golf and we are reluctantly, anxiously, suspiciously impressed.

Three strokes back of Sam. Two rounds remaining. Strap in.`,
      },
      summary: `Day 2 in the books. Sam shot a 61. Same number as Jamie. Same number as Keo. Josh shot a 62. Sam's three-stroke margin from Day 1 is, somehow, still three strokes after Day 2. The chase didn't close anything.

Sam's back 9 was a 29. EAGLE on hole 13, birdies on 11, 14, 15, 17, 18, three pars, no bogeys. After the entire field caught up to within a stroke on the front, Sam responded by shooting the lowest back 9 of the tournament so far.

Jamie's back 9 was also exceptional — 30 strokes with an eagle on hole 15 (back-to-back days he's eagled that hole). Keo posted his second consecutive disciplined back 9: 5 birdies + 4 pars + 0 bogeys. Josh's back 9 had one inefficient bogey on hole 12 but otherwise six birdies and pars.

Season after two rounds: Sam -21, Jamie -18 (T2), Keo -18 (T2), Josh -17. Two days, 36 holes remain. The chasing pack needs Sam to wobble. Based on the evidence to date (one bogey total, an eagle on hole 13, a 29 back nine in response to the field catching up), the probability of a Sam wobble is rounding to zero.`,
    },
  },
  emptyRound(3, "Day 3"),
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = `Day 2 is done. Sam shot a 61 today after his 62 yesterday. Across 36 holes he is -21 for the tournament. He has bogeyed exactly one hole in two complete rounds at Augusta.

Jamie and Keo are tied for second at -18 — both also shot 61 today, matching the leader stroke for stroke. The chase is still mathematically alive but the leader has not given an inch since the front 9 of Day 2, when he briefly let the field catch up to within one stroke. He responded by shooting a 29 on the back nine, including an eagle on hole 13. Josh is fourth at -17.

Two rounds remaining. 36 holes left. The chasing pack needs a Sam meltdown. Based on the evidence to date — one bogey across 36 holes, a 29 on the back nine in direct response to being chased — the probability of meltdown is approximately the same as the probability of a polite Augusta winter.

Day 3 tomorrow. Strap in.`
