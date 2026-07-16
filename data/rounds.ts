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

// Day 3 — complete. Back 9 played in two sittings: holes 10-15, then 16-18 separately
// after Sam's connection dropped.
// Sam: front 3,4,4,3,4,2,4,4,3 (31, -5 — birdies 1, 2, 6, 8, 9)
// Back 9 given as results, converted against par: birdie 10, birdie 11, par 12, birdie 13,
// birdie 14, eagle 15, par 16, par 17, par 18 → 3,3,3,4,3,3,3,4,4 = 30, -6.
// Total: 31 + 30 = 61, -11.
const sam_r3 = holesFromStrokes([3,4,4,3,4,2,4,4,3,  3,3,3,4,3,3,3,4,4])
// Keo: front 4,3,4,3,4,2,3,5,3 (31, -5 — eagle on 2, third day running)
// Back 9 in two sittings: holes 10-14 (3,3,4,3,3 = 16, -4), hole 15 not captured on screen but
// confirmed a birdie (par 5 → 4), then 16-18 (2,3,3 = 8, -3). Back 9: 28, -8.
// Total: 31 + 28 = 59, -13. Seven birdies, an eagle on 13, one bogey on 12, no pars.
const keo_r3 = holesFromStrokes([4,3,4,3,4,2,3,5,3,  3,3,4,3,3,4,2,3,3])
// Jamie: front 4,4,3,3,3,3,4,4,3 (31, -5 — five birdies, no bogeys)
// Back 9 in two sittings: holes 10-15 (4,3,3,4,4,4 = 22, -3) then 16-18 (2,3,3 = 8, -3).
// Back 9: 30, -6. Total: 31 + 30 = 61, -11. Closed birdie-birdie-birdie.
const jamie_r3 = holesFromStrokes([4,4,3,3,3,3,4,4,3, 4,3,3,4,4,4,2,3,3])
// Josh: front 3,3,4,3,4,2,4,5,4 (32, -4 — birdie-eagle start, led through 6, par-par-par finish)
// Back 9 played in two sittings after Sam's connection dropped: holes 10-15 (3,4,3,4,3,3 = 20, -5)
// then 16-18 separately (2,4,3 = 9, -2). Back 9: 29, -7. Total: 32 + 29 = 61, -11.
const josh_r3 = holesFromStrokes([3,3,4,3,4,2,4,5,4, 3,4,3,4,3,3,2,4,3])

const r3Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r3,   front9Strokes: 31, front9ToPar: -5, back9Strokes: 30, back9ToPar: -6, totalStrokes: 61, totalToPar: -11 },
  josh:  { holes: josh_r3,  front9Strokes: 32, front9ToPar: -4, back9Strokes: 29, back9ToPar: -7, totalStrokes: 61, totalToPar: -11 },
  jamie: { holes: jamie_r3, front9Strokes: 31, front9ToPar: -5, back9Strokes: 30, back9ToPar: -6, totalStrokes: 61, totalToPar: -11 },
  keo:   { holes: keo_r3,   front9Strokes: 31, front9ToPar: -5, back9Strokes: 28, back9ToPar: -8, totalStrokes: 59, totalToPar: -13 },
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
    status: "complete",
    scorecards: r3Scorecards,
    commentary: {
      players: {
        sam: `Keo shot a 59 and took the lead. For roughly forty minutes this tournament had a new leader and a genuine plot. Sam then needed exactly -6 on the back nine to take it back. He shot exactly -6.

Birdie-birdie to open the back — a lovely pair of boys — then a birdie on 13, a birdie on 14, and an eagle on 15, the hole Jamie had spent two days treating as a second home. Lead recovered, sums done, and he closed par-par-par and went to bed.

Which is the part that should frighten everyone. Josh finished the FRONT nine par-par-par and got buried for it in this very column. Sam finished the BACK nine par-par-par and won the day's argument. Same three holes, same three scores, entirely opposite verdicts, because one of them had already done the work.

Worth noting the back nine was played in two sittings, on account of Sam's internet dying immediately after he'd eagled the 15th to retake the lead. Everyone reconvened, and he calmly parred the last three to win by one. We're not saying anything. We're simply laying the events out in chronological order and letting you sit with them.

61 for the day. -32 for the tournament. ONE bogey in 54 holes — hole 9, Day 1, nothing since. He leads by a single stroke, the closest anyone has been all week, and he still looks like a man with his feet up.`,

        josh: `The front nine was a crime scene. Josh opened birdie-EAGLE, led at -4 through six with the confidence radiating off him like a man who'd just been told his zone 1-2 travelcard covers zone 3, and then finished par-par-par while every other player played those same three holes in -2. He led for seven holes and finished the batch dead last. That's not bad luck, that's a Mark Corrigan life choice.

We stand by every word of it. But we do have an update: the back nine was a 29.

Five birdies (10, 13, 14, 16, 18), an eagle on 15, three pars, not a single dropped shot. -7 — the lowest back nine anyone had managed all tournament until Keo went and beat it about an hour later. 61 for the day, comfortably his best round of the week, produced roughly twenty minutes after being publicly buried. God I back that line.

And he's STILL last. -28, four off the lead, because Keo shot a 59 and Sam produced precisely the number he needed. Josh played the best golf of his tournament and gained nothing on anybody.

Here is the statistic that should be read aloud at his funeral: Josh has won zero holes outright all tournament. Zero. Not one hole, all week, where he alone had the best number on the board. There's something almost beautiful about it — a man sprinting up a downward escalator, and the escalator is Sam Clifford.`,

        jamie: `Jamie shot a 61 without ever raising his voice. Five birdies on the front, six on the back, no bogeys after lunch, and he closed birdie-birdie-birdie through 16, 17 and 18.

That finish matters. He bogeyed the 18th on Day 1. He bogeyed the 18th on Day 2. Two consecutive days of walking off the last with a dropped shot in his pocket, and tonight he birdied it. Growth. Visible, documented growth.

The bad news is he lost the 15th. Two days running he'd eagled that hole — it was his, it had his name on the deed — and tonight he made a four while Sam AND Josh both made threes on it. He birdied his own hole and still went backwards on it. Being evicted by two other men on the same evening is a very specific humiliation.

-29 for the tournament, third, three off the lead. The exact same three strokes he's been behind since Thursday. Keo closed to one tonight. Josh shot a 29. Jamie shot a 61, played beautifully, and finished the evening standing in precisely the spot where he started it. Maybe Jamie should keep focused on his own putts.`,

        keo: `Keo shot a FIFTY-NINE.

The eagle on hole 2 turned up as scheduled — third day running, it's a residency now, the hole should be charging him rent — but that isn't the story. The story is the back nine. A 28. Seven birdies, an eagle on 13, one bogey, and not a single par. Nine holes and not one of them was ordinary.

Lowest nine of the tournament. Lowest round of the tournament by two clear shots. And for a genuine, verifiable stretch of the evening, JamesKeo126 led the Masters.

This is a man who opened this tournament with a six on hole one.

The bogey on 12 was his first dropped shot since hole 1 of Day 2 — 28 holes clean — and it died on a par 3, which is the golfing equivalent of getting done by a speed camera on your own road.

-31, second, one back. Sam needed -6 to hold him off and produced exactly -6, which at this point feels less like golf and more like a haunting. But it's ONE stroke. It has been three since Thursday. Keo is the only man all week who has actually made Sam Clifford go and look for something.`,
      },
      summary: `Day 3 is done and it finally, FINALLY happened. Somebody moved Sam.

Keo shot a 59. A back nine of 28 — seven birdies, an eagle on 13, no pars whatsoever — and for a real stretch of the evening he led this tournament outright. Sam then needed exactly -6 on his own back nine to take it back, and shot exactly -6. Eagle on 15, then par-par-par to the house, because the maths was already done.

Which is the joke of the entire day. Josh finished the FRONT nine par-par-par and got demolished for it in this column. Sam finished the BACK nine par-par-par and won. Same three holes, same three pars. The difference is that one of them had a lead in the bank and the other had a personality.

Josh, to his credit, responded to being buried by shooting a 29 — five birdies, an eagle on 15, no bogeys, his best round of the week — and is still last. Jamie shot 61, closed birdie-birdie-birdie, and finally birdied the 18th after bogeying it on both previous days. He also lost the 15th to Sam and Josh on the same night, a hole he'd eagled twice. The whole back nine was played in two sittings because Sam's connection dropped, which we mention only for the record.

Three 61s and a 59. Nobody shot worse than -11. Nobody has ever needed a calculator this badly.

Season through 54 holes: Sam -32, Keo -31, Jamie -29, Josh -28. The lead is ONE. It has been three since Thursday. Eighteen holes left and, for the first time all week, this is a tournament.`,
    },
  },
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = `Fifty-four holes gone and Sam Clifford is -32 with ONE bogey. One. Hole 9, Day 1. Forty-five consecutive holes since without dropping a shot.

But the lead is one stroke, and that is new. It was three on Thursday, three on Friday, three on Saturday afternoon. Then Keo shot a 59 — a 28 on the back with seven birdies and no pars — took the lead outright, and forced Sam to go and find exactly the -6 he needed to reclaim it. He found it, obviously. He always finds it. But he had to go and look, which is further than anybody has made him walk all week.

Sam -32 and Keo -31 at the top: a lovely pair of boys, separated by a single stroke and a quantity of accumulated resentment that no scorecard can hold.

Jamie is -29, playing beautiful golf directly into a void, three off the lead exactly as he has been since day one. Josh is -28 and last, having just posted the best round of his week — a 29 on the back with an eagle — and gained precisely nothing for it. Somewhere, a documentary crew is nodding slowly.

One round left. Eighteen holes, one stroke. After three days of a coronation, it's a fight.`
