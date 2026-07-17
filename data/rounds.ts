import type { Round, Scorecard, Hole, PlayerId } from "./types"
import { HOLE_PARS } from "./course"

// Helper for building scorecards. Used here, not exported.
function holesFromStrokes(strokes: (number | null)[]): Hole[] {
  if (strokes.length !== 18) throw new Error("expected 18 holes")
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: strokes[i] }))
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

// Day 4 — front 9 played, back 9 not yet. Group hungover after England's loss to Argentina.
// Sam played the round in a lime green bucket hat.
// Sam: 4,3,3,3,4,2,4,4,3 → 30 strokes, -6 (eagle on 2; birdies 3, 6, 8, 9; best front 9 of his week)
const sam_r4 = holesFromStrokes([4,3,3,3,4,2,4,4,3,  null,null,null,null,null,null,null,null,null])
// Keo: 4,3,3,3,4,3,4,5,3 → 32 strokes, -4 (eagle on 2 for the fourth straight day; birdies 3, 9; six pars)
const keo_r4 = holesFromStrokes([4,3,3,3,4,3,4,5,3,  null,null,null,null,null,null,null,null,null])
// Jamie: 3,5,4,3,4,3,4,4,3 → 33 strokes, -3 (birdies 1, 8, 9; six consecutive pars through the middle)
const jamie_r4 = holesFromStrokes([3,5,4,3,4,3,4,4,3, null,null,null,null,null,null,null,null,null])
// Josh: 4,4,4,3,4,3,3,6,3 → 34 strokes, -2 (birdies 2, 7, 9; a six on the par-5 8th)
const josh_r4 = holesFromStrokes([4,4,4,3,4,3,3,6,3, null,null,null,null,null,null,null,null,null])

const r4Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r4,   front9Strokes: 30, front9ToPar: -6, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  josh:  { holes: josh_r4,  front9Strokes: 34, front9ToPar: -2, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  jamie: { holes: jamie_r4, front9Strokes: 33, front9ToPar: -3, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  keo:   { holes: keo_r4,   front9Strokes: 32, front9ToPar: -4, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
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
        sam: `For the first time in this tournament, Sam Clifford was ordinary.

Understand the scale we're grading on: he shot a 61, went -11, eagled the 15th, and is still top of the board. And it was a flat evening. Keo shot a 59 and took the lead off him. Sam's back nine was a 30; Keo's was a 28 and Josh's a 29. For the first time all week, Sam's nine wasn't the best in the room. It wasn't even second.

Then the finish. Pars on 17 and 18 to sign off with the tournament still live. Perhaps not such a lovely pair of boys.

Because here's the thing. We spent the entire front-nine column mocking Josh for closing par-par-par. Sam then closed his own back nine par-par-par and came within one stroke of handing the whole thing over. Same three holes, same three scores. We'd like to formally apologise to Josh Dally.

Worth noting the back nine was played in two sittings, on account of Sam's internet dying immediately after he'd eagled the 15th. Everyone reconvened. He parred out. We're not saying anything — we're simply laying the events out in chronological order and letting you sit with them.

61 for the day, -32 for the tournament, one bogey in 54 holes, still leading. But the margin went from three to one, and for the first time all week, you could see him working.`,

        josh: `We're not doing the bit tonight.

Josh got taken apart in this column for the front nine. Led at -4 through six, finished par-par-par, and we called it a Mark Corrigan life choice and enjoyed ourselves enormously. Then he went out and shot a 29.

Five birdies (10, 13, 14, 16, 18), an eagle on 15, three pars, not one dropped shot. -7 on the back — the lowest nine anybody had managed all tournament, until Keo beat it about an hour later. 61 for the day, his best round of the week, produced roughly twenty minutes after being publicly buried. God I back that line.

That is a proper response. Most people, having been informed in writing that their collapse was a lifestyle choice, would have gone quietly into the back nine and shot a 34. Josh went out and played the best golf of his week.

-28 and last, four off the lead, which on a night he played like this is genuinely unjust. The only reason he isn't in this fight is that Keo shot a 59 and Sam refuses to make bogeys. Four back with 18 to play is not nothing. Let the man have this one.`,

        jamie: `Jamie shot a 61 and very nearly had his second career hissy fit about it.

The golf first, because it was excellent. Five birdies on the front, six on the back, no bogeys after lunch, and he closed birdie-birdie-birdie through 16, 17 and 18. That finish matters: he bogeyed the 18th on Day 1 and bogeyed it again on Day 2. Two days of walking off the last with a dropped shot in his pocket, and tonight he birdied it. Visible, documented growth.

Now the incident. There has been exactly one Maclaren hissy fit in recorded history. Tonight came within touching distance of the second, and the trigger was his own assessment that the evening had been "average" — a description of a 61 that the rest of the group found medically concerning. Somewhere in the ensuing commotion a putt slipped past the hole by what he described, with real feeling, as a bee's dick. The unit has since been adopted into this tournament's official system of measurement. It was the funniest thing said all night and it will comfortably outlive every shot he hit.

The one legitimate grievance: he lost the 15th. Two days running he'd eagled that hole — it had his name on the deed — and tonight he made a four while Sam AND Josh both made threes. Evicted from his own hole by two men on the same evening.

-29, third, three off the lead. The exact three strokes he's been behind since Thursday. Keo closed to one tonight. Jamie played lovely golf and finished the evening standing precisely where he started it.

Average, though. Sure.`,

        keo: `Keo shot a FIFTY-NINE.

The eagle on hole 2 arrived on schedule — third day running, it's a residency now, the hole should be charging rent — but that isn't the story. The story is the back nine. A 28. Seven birdies, an eagle on 13, one bogey, and not a single par. Nine holes, not one of them ordinary. That was liquid golf.

Lowest nine of the tournament. Lowest round of the tournament by two clear shots. And for a genuine, verifiable stretch of the evening, JamesKeo126 led the Masters. This is a man who opened this tournament with a six on hole one.

Which brings us to the 12th, and to three feet.

Three feet. Flat. The sort of putt you'd concede to a stranger. He missed it like a man who had been handed a putter earlier that afternoon and was still forming a relationship with it. It is the only blemish on the greatest round anybody has played all week, and it ended a run of 28 holes without a dropped shot. Twenty-eight holes of immaculate golf, undone by a distance you could cover by falling over.

-31, second, one back. Sam found the -6 he needed to hold him off, because he always does. But it's ONE stroke now, and it has been three since Thursday. Keo is the only man all week to make Sam Clifford look even slightly mortal.

That putt, though. Three feet.`,
      },
      summary: `Day 3 is done and for one evening the spell broke.

Keo shot a 59. A back nine of 28 — seven birdies, an eagle, not a single par — and for a genuine stretch of the night he led this tournament outright. Lowest round of the week by two clear shots. The only blemish on it was a three-foot putt on the 12th, missed in a manner best described as recreational.

Sam, by his own preposterous standards, was flat. He shot 61, went -11, eagled the 15th, and STILL lost two strokes of his lead, because his back nine was a 30 while Keo made 28 and Josh made 29. For the first time all tournament, Sam's nine wasn't the best in the room. He then closed par-par-par — the precise finish we spent the entire front-nine column mocking Josh for — with the thing still live. Apologies are owed to Josh Dally.

Josh, for the record, was excellent. A 29 on the back with an eagle on 15 and no bogeys, his best round of the week, produced about twenty minutes after being publicly buried in this column. He's still last, which is genuinely unfair. Let him have it.

Jamie shot 61, closed birdie-birdie-birdie, and finally birdied the 18th after bogeying it on both previous days. He also came within touching distance of his second career hissy fit, on the grounds that his own evening had been "average". At some point a putt slipped past the hole by a bee's dick. The phrase has since been adopted as a unit of measurement.

Three 61s and a 59, nobody worse than -11, and the whole back nine played in two sittings because Sam's internet died. We mention that last part only for the record.

Season through 54 holes: Sam -32, Keo -31, Jamie -29, Josh -28. The lead is ONE. It has been three since Thursday. Eighteen holes left and, for the first time all week, this is a tournament.`,
    },
  },
  {
    id: "round_4",
    roundNumber: 4,
    label: "Day 4",
    status: "in_progress",
    scorecards: r4Scorecards,
    commentary: {
      players: {
        sam: `Sam Clifford turned up in a lime green bucket hat.

Establish the facts first. England lost to Argentina. The group drank accordingly. Everybody arrived in no condition whatsoever to play golf, and three of the four scorecards are a full confession. Sam — who was at the same match, presumably drinking from the same taps — put a lime green bucket hat on his player and shot the best front nine of his tournament.

30. -6. Eagle on the 2nd, birdies on 3, 6, 8 and 9, four pars, nothing dropped. His previous best front nines this week were 32, 32 and 31. He has never played this stretch better in his life, and he elected to do it hungover, in a hat that Jamie and Josh regard as a form of common assault.

The hat was not an accident. Nobody puts a lime green bucket hat on their man at Augusta National by mistake. You do it because you know that two of the four people in the room hold sincere, deeply-felt views about how this game ought to look, and you want to find out what happens to their golf when you offend them. What happened to their golf: -3 and -2.

The lead was one stroke last night. It is three again now — the number this tournament keeps returning to, like a law of physics that bent for one evening and has snapped back into place.

Nine holes left, and Sam Clifford is three clear in a lime green bucket hat.`,

        keo: `The eagle on hole 2 arrived for the FOURTH consecutive day. Four rounds, four threes on that par 5. The residency is now a freehold.

And then the rest of it was a 32, and the rest of it was flat. Two birdies, six pars, nothing dropped and nothing much gained. -4, which on any ordinary evening is a perfectly good nine of golf, and which tonight cost him two strokes, because Sam shot -6. The one became three.

In fairness, everyone was hungover. England lost to Argentina, the group drank in the traditional manner, and three of these four cards show the damage. Keo's is one of them — a man going round on autopilot with one glorious exception on the second hole, which at this point he could probably eagle in his sleep and may well have.

-35, second, three back with nine to play. He shot a 28 on this very nine last night. The round he needs is a round he has already played, once, twenty-four hours ago, which is either enormously encouraging or the cruellest fact in this tournament.

Something exceptional, or nothing at all.`,

        jamie: `Jamie shot a 33 and went very, very quiet.

Birdie on the 1st, birdie-birdie to close on 8 and 9, and six consecutive pars in between — the golfing equivalent of standing extremely still and hoping the evening passes over you. -3, no bogeys, nothing wrong with it, and two strokes worse than the man he needed to catch.

He also had to look at a lime green bucket hat for nine holes. Jamie holds views on this. Jamie holds views on golf attire in roughly the way other men hold religious convictions, and Sam knows this precisely, which is the entire reason the hat exists. It is not decoration. It is ordnance.

Notably, he made six pars in a row without once reaching for the bee's dick, which we're reading as either growth or defeat.

-32, third, six back with nine to play. It's gone and he knows it's gone. He played 54 holes of genuinely lovely golf, never once got within three of the lead, and has now been seen off by a man in a hat. He left the last session visibly depressed. Tonight will not have helped.`,

        josh: `Josh shot a 34 and made a six on the 8th.

Par 5. Six. It's the only dropped shot on any card tonight and it belongs to the man having the worst week here. Around it: birdies on 2, 7 and 9, five pars, -2, and the general air of a man completing a round of golf because the alternative is saying out loud that it's over.

In his defence — and we've decided to be in his defence these days — the whole group was hungover. England lost to Argentina, everyone drank, and the golf was always going to pay for it. Josh's card just paid a little more than everybody else's.

He also spent the evening looking at Sam's lime green bucket hat, which for a man of Josh's convictions about this game is roughly equivalent to watching someone eat a Sunday roast with their hands. It wasn't aimed exclusively at him. It landed anyway.

-30, last, eight back with nine to play. He left the last session depressed and this one won't have fixed anything. There are still nine holes, and everybody already knows how they end.`,
      },
      summary: `Day 4's front nine, and the only thing anybody is going to remember is the hat.

Sam Clifford dressed his player in a lime green bucket hat. Jamie and Josh — who hold sincere, deeply-felt views about the traditions of this game — then had to look at it for nine holes. Sam shot a 30, the best front nine of his tournament. They shot 33 and 34. The hat was not decoration. The hat was ordnance. It worked.

The context: England lost to Argentina, the group drank accordingly, and everybody arrived in no condition to play golf. Three of the four scorecards are a confession. Sam's reads -6, with an eagle on the 2nd and four birdies, which raises the question of whether he attended the same match, drank in the same pub, or belongs to the same species.

Keo eagled the 2nd for the FOURTH consecutive day — four rounds, four threes, the residency is a freehold now — and then made six pars and shot -4. Fine golf on any ordinary night. Tonight it cost him two strokes. Josh made a six on the par-5 8th, the only dropped shot on any card. Jamie made six pars in a row and said nothing at all.

The lead was ONE last night. It is THREE again now. That number has followed this tournament around since Thursday like a smell.

Season through 63 holes: Sam -38, Keo -35, Jamie -32, Josh -30. Nine holes left. Keo needs something exceptional, and he shot a 28 on this exact nine twenty-four hours ago, so at least he knows the number exists. Jamie and Josh need a different sport.`,
    },
  },
]

export const SEASON_COMMENTARY: string | null = `Sixty-three holes and Sam Clifford is -38 in a lime green bucket hat.

The hat gets the top line because the hat was deliberate. Two of the four men in this tournament hold sincere views about how golf ought to look, Sam is entirely aware of this, and so he dressed his player in lime green and made them watch it for nine holes. Then he shot the best front nine of his week. Hungover. While they came apart.

Because that's the other half of it: England lost to Argentina, the group drank, and three of the four scorecards are a confession. Not Sam's. Sam went -6 with an eagle and four birdies, has one bogey in 63 holes, and has stretched a lead that was — briefly, thrillingly, for about one evening — down to a single stroke.

Keo is -35 and three back, and he is the only live challenger left. He shot a 28 on this back nine last night, which means the round he needs is a round he has already played. Once. Twenty-four hours ago. Jamie is -32 and Josh is -30, and both left the last session visibly depressed, which is the only sane response to what is being done to them.

Nine holes. Three strokes. One hat.`
