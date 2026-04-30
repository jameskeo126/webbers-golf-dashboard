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
  emptyRound(2, "Day 2"),
  emptyRound(3, "Day 3"),
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = `Day 1 is in the books. Sam Clifford leads at -10. Read that again — minus ten. He shot a 62 at Augusta in his opening round: one eagle, nine birdies, seven pars, one bogey. Bogey-free on the back. The rest of the field is tied at -7, three strokes back, three days remaining.

Josh, Jamie and Keo all share second. Josh finally produced per-hole numbers on the back 9 (the front 9 audit remains pending). Jamie went from metronome to two-eagle assassin in the space of nine holes. Keo turned in the only quietly competent round of his career so far. Strange day.

Three more days, six 9-hole batches still to play. Sam has to keep his composure. The chasing pack has to find another three strokes from somewhere — and they need to find them in the same round, otherwise Sam just trades wins. Strap in for Day 2.`
