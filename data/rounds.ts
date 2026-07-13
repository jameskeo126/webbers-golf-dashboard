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

// Day 3 — front 9 played, back 9 not yet.
// Sam: 3,4,4,3,4,2,4,4,3 → 31 strokes, -5 (birdies 1, 2, 6, 8, 9 — closed birdie-birdie)
const sam_r3 = holesFromStrokes([3,4,4,3,4,2,4,4,3,  null,null,null,null,null,null,null,null,null])
// Keo: 4,3,4,3,4,2,3,5,3 → 31 strokes, -5 (eagle on 2 — third day running)
const keo_r3 = holesFromStrokes([4,3,4,3,4,2,3,5,3,  null,null,null,null,null,null,null,null,null])
// Jamie: 4,4,3,3,3,3,4,4,3 → 31 strokes, -5 (five birdies, no bogeys)
const jamie_r3 = holesFromStrokes([4,4,3,3,3,3,4,4,3, null,null,null,null,null,null,null,null,null])
// Josh: 3,3,4,3,4,2,4,5,4 → 32 strokes, -4 (birdie-eagle start, led through 6, par-par-par finish)
const josh_r3 = holesFromStrokes([3,3,4,3,4,2,4,5,4, null,null,null,null,null,null,null,null,null])

const r3Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r3,   front9Strokes: 31, front9ToPar: -5, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  josh:  { holes: josh_r3,  front9Strokes: 32, front9ToPar: -4, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  jamie: { holes: jamie_r3, front9Strokes: 31, front9ToPar: -5, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  keo:   { holes: keo_r3,   front9Strokes: 31, front9ToPar: -5, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
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

-21 for the season, three strokes clear of Jamie and Keo (T2 at -18). The wobble was a feint. Sam responded to the entire chasing pack catching up to within a stroke by shooting the lowest back 9 we have on record. God I back that line. The man is a monster.`,

        josh: `Josh's back 9 was -5: six birdies (10, 13, 14, 15, 17 and 18), two pars, and one bogey on hole 12 — a four on a par 3, which is a special kind of inefficiency.

He also took at least one verbal hit from Sam over the course of the night that he probably won't be growing back from any time soon.

62 for the day, -17 for the tournament. Sole 4th place, one stroke off the T2 pack. Sam shot a 61 on top of the 62 he shot yesterday. Four strokes back, two rounds to go. The chase is, charitably, uphill.`,

        jamie: `Jamie shot a sixty-one. Same number Sam shot. Same number Keo shot. Three players, three 61s, no one closed any ground on the leader at all.

The back 9 was the work of someone who has obviously been studying the leader. Five birdies (11, 12, 14, 17), an eagle on hole 15 (yes — same hole he eagled yesterday, par 5, three on the card both times), two pars, and a closing bogey on 18 because he has to remind us he's human.

Maybe Jamie should keep focused on his own putts.

Day 2 total: -11. Season: -18, tied second with Keo. One day ago we called Jamie a metronome. We have been bleeding since. If this Jamie shows up tomorrow the leader's three-stroke margin is in real danger.`,

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
  {
    id: "round_3",
    roundNumber: 3,
    label: "Day 3",
    status: "in_progress",
    scorecards: r3Scorecards,
    commentary: {
      players: {
        sam: `Sam spent most of the front 9 in second place, which was novel while it lasted. Josh had opened birdie-eagle and was strutting about like David Brent doing the guided office tour, and Sam just... waited. Birdies on 1 and 2 to keep contact, a run of pars through the middle, a two on the par-3 6th, and then — right when it mattered — birdies on 8 and 9. A lovely pair of boys.

That closing pair turned a decent nine into a 31 and turned Josh's evening into a cautionary tale. -5 on the front, level best score of the batch, lead intact at three.

Sam is now -26 through 45 holes with ONE bogey all tournament. At this point the leaderboard isn't a competition, it's a hostage situation.`,

        josh: `Right. Let's talk about it.

Josh opened birdie-EAGLE. Three under after two holes. Led the group for essentially the entire evening — through 6 he was -4 and everyone else was scrambling around at -3, and you could hear the confidence radiating off him like a man who'd just been told his zone 1-2 travelcard covers zone 3. Then the last three holes happened. Par. Par. Par. Nothing catastrophic — no blow-ups, no water, no shame spiral — just three flat pars while every single other player finished -2 over the same stretch. Sam went birdie-birdie. Jamie went birdie-birdie. Keo birdied 9. Josh watched.

Led for seven holes, finished the batch dead last. That's not bad luck, that's a Mark Corrigan life choice. -4 on the day, -21 for the season, sole last, five off the lead. The chase was uphill before. It's now uphill in the rain.`,

        jamie: `Jamie put together the quietest 31 you'll ever see: five birdies (2, 3, 5, 8, 9), four pars, zero bogeys, zero drama, zero unsolicited putting seminars. Progress on all fronts.

He matched Sam shot-for-shot down the stretch — birdies on 8 and 9 while Josh was busy composting his own lead — and stays tied second at -23. Still three behind, which has been the exact size of the gap since Day 1, like it's been nailed on.

The concern for the field is that Jamie has now played 45 holes with two eagles, a stack of birdies and barely a mistake, and it's STILL not enough. The concern for Jamie is that at some point he'll need to do it while Sam doesn't. No sign of that yet.`,

        keo: `Keo eagled hole 2. Again. That's three days running he's made a three on that par 5 — Day 1, Day 2, Day 3, eagle, eagle, eagle. At this point it's not skill, it's a standing arrangement. The hole should start charging him rent.

The rest of the nine was tidy in the way that new-era Keo is now upsettingly tidy: birdies on 6, 7 and 9, five pars, nothing dropped. 31 strokes, -5, keeping perfect pace with the leader and Jamie.

-23 for the season, tied second, three back with 27 holes left. The eagle machine on hole 2 has become the most reliable thing in this tournament apart from Sam refusing to bogey. One of those two things has to break eventually. Surely.`,
      },
      summary: `Day 3, front 9 done, and the night belonged to Josh right up until it emphatically didn't. He opened birdie-eagle, led at -4 through six, and then finished par-par-par while literally everyone else played the last three in -2. Sam closed birdie-birdie — a lovely pair of boys — Jamie closed birdie-birdie, Keo birdied the 9th, and Josh finished the batch he'd led all evening in last place. You almost have to admire the shape of it.

Elsewhere: three players shot 31. Keo eagled hole 2 for the THIRD CONSECUTIVE DAY, which is now less a golf statistic and more a planning permission issue. Hole 6, the par 3, gave up three separate 2s (Sam, Josh, Keo). And Jamie birdied five holes without saying a single word about anyone's putting stroke, which we're calling character growth.

Season through 45 holes: Sam -26, Jamie -23 (T2), Keo -23 (T2), Josh -21. The gap at the top remains three strokes, as it has since roughly the dawn of time. Back 9 of Day 3 to come.`,
    },
  },
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = `Forty-five holes played and Sam Clifford is -26 with one bogey. One. The lead has been exactly three strokes since Day 1 and shows no sign of moving — the man closed the Day 3 front nine with back-to-back birdies the moment he was briefly headed. A lovely pair of boys, delivered with the warmth of a debt collector.

Jamie and Keo are tied second at -23 and both playing genuinely superb golf into a total void. Jamie has two eagles and barely a blemish across 45 holes. Keo has eagled hole 2 on all three days, which is no longer variance, it's a residency. Neither has gained a single stroke on the lead since Thursday.

And then there's Josh, -21, sole last, five back — having led the most recent nine holes for almost their entirety before finishing par-par-par while everyone else birdied around him like he wasn't there. Somewhere, a documentary crew is nodding slowly.

Back 9 of Day 3 still to play, then Day 4. 27 holes for someone to make this a contest. Strap in.`
