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

// Day 1 — front 9 played, back 9 not played.
// Sam: 4,3,3,2,3,3,4,5,5 → 32 strokes, -4
const sam_r1 = holesFromStrokes([4,3,3,2,3,3,4,5,5,  null,null,null,null,null,null,null,null,null])
// Keo: 6,3,3,4,3,3,5,4,3 → 34 strokes, -2
const keo_r1 = holesFromStrokes([6,3,3,4,3,3,5,4,3,  null,null,null,null,null,null,null,null,null])
// Jamie: 4,4,4,3,4,3,4,5,4 → 35 strokes, -1
const jamie_r1 = holesFromStrokes([4,4,4,3,4,3,4,5,4, null,null,null,null,null,null,null,null,null])
// Josh: per-hole unknown but front9ToPar = -2 (so front9Strokes = 34)
const josh_r1 = holesFromStrokes(Array(18).fill(null))

const r1Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r1,   front9Strokes: 32, front9ToPar: -4, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  josh:  { holes: josh_r1,  front9Strokes: 34, front9ToPar: -2, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  jamie: { holes: jamie_r1, front9Strokes: 35, front9ToPar: -1, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  keo:   { holes: keo_r1,   front9Strokes: 34, front9ToPar: -2, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
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
    status: "in_progress",
    scorecards: r1Scorecards,
    commentary: {
      players: {
        sam: `Sam — first round, front 9, ALREADY -4. Eagle on the par-5 second, then a treble-birdie streak across 3, 4 and 5 like he's been having a quiet practice block none of us were invited to. The rest of the lads were stood there with their wedges drying on the tee pretending not to see the scoreboard. Suspiciously good putting? Mate, this is Augusta in April, not the local pitch and putt. We need to see the swing analyser. Then — mercifully — the great fraud reveal: a five on the par-4 ninth. A bogey to close the front. Couldn't even keep the ribbon-cutting tidy. Still, -4 through nine. Set up like he's been rehearsing this entire weekend in private mode. We see you, Sam Clifford. We've got 27 holes to drag him back to the rest of us.`,

        josh: `Josh "the data scientist" Dally has just submitted what may be the most aggressively vague scorecard in modern competitive golf. Front 9: -2. How? Don't know. Hole-by-hole? Refused to file. Methodology? CLASSIFIED. There is, in the official record, simply a number — minus two — and a polite man's hope that no one asks follow-up questions. "Trust me," says Josh, the guy who ALSO claimed last week he 'almost' eagled the 14th and we all watched him three-putt from twelve feet. Look — we'll take it. -2 is -2, even if it arrived in a brown envelope marked "do not investigate." But for the record, joshdally, when those nine missing numbers turn up, we will be reading them out one by one in chronological order. With commentary. Possibly under oath. The audit will be brutal.`,

        jamie: `Jamie Maclaren has spent nine holes proving that golf, played correctly, is the most boring sport on the planet. One birdie on the second. Then seven consecutive pars. SEVEN. He didn't push. He didn't gamble. He didn't make a single decision worth retelling. -1 is the score of a man who spreadsheets his own emotions. Watching umie51 play right now is like watching someone fold a fitted sheet on the first attempt — technically impressive, deeply unsettling, no one's enjoying themselves. Meanwhile Sam's eagling and Keo's having an absolute psychotic episode out there, and Jamie's posting pars like he's billing them by the hour. Look, Maclaren — we know this is an Australian thing, the boring excellence. But you're playing The Masters here. Hit a tree. Three-putt something. Show us a HEARTBEAT. The leaderboard says you're fourth and we're not surprised. Wake up.`,

        keo: `Hames Keo — a man who has, in the space of nine holes, managed to play both the worst and the best round of golf any of us has ever witnessed. Hole one: a SIX on a par 4. Double bogey, opening tee, in front of God and the entire WhatsApp group. The man almost packed up and went home. THEN. Hole two: a 3 on the par 5. EAGLE. Same player, same club, same morning. We checked three times — yep, that's our boy. From there it was just chaos: birdies on 3, 5, 8 and 9, a par on 6, two more bogeys for good measure. Final tally: -2. JamesKeo126 has a method, and the method is "throw it all in a bag and shake." Look, anyone can shoot -2 on the front 9. Only Keo can shoot -2 with a 6 and an eagle on consecutive holes. This is sport.`,
      },
      summary: `Day 1, front 9 in the books, and the leaderboard tells you everything you need to know about the personalities sat at the top of it. Sam Clifford leads at -4, on the back of an eagle and a three-birdie streak that looked rehearsed enough to warrant a grand jury investigation. Josh and Keo are both at -2, but in two completely different ways: Keo got there via a double bogey on hole one followed immediately by an eagle on hole two — a whiplash trajectory that frankly should be classified as a medical event — while Josh got there by submitting a card that says "-2" and refusing to elaborate. The audit will come. Jamie is fourth at -1, posting eight pars and one birdie like a man being paid by the hour to be unremarkable. There's a 2-stroke gap between Sam and the chasing pack — small enough to close, large enough to look like a beating in EA Sports' on-screen scoreboard. Back 9 still to play on Day 1, and three more days after that. Eight more 9-hole batches. It's only just started.`,
    },
  },
  emptyRound(2, "Day 2"),
  emptyRound(3, "Day 3"),
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = `Welcome to the season report after exactly one (1) front nine. Already there's a leader and a complete shambles, which is well ahead of schedule. Sam Clifford has set the pace at -4, putting him two strokes clear of the chasing pack and forcing the rest of us into a public discussion about whether he has, in fact, secretly been practising. The chasing pack — Josh "I refuse to submit hole-by-hole data" Dally and Hames "double bogey then eagle" Keo — are tied at -2. Jamie is fourth at -1, posting numbers so consistent they've started warning insurance underwriters. There are seven 9-hole batches still to play across Days 2, 3 and 4 plus the back 9 of Day 1. Plenty of room for Sam to choke the lead away. Plenty of room for Keo's chaos style to either win the tournament or get him spectacularly swallowed by a water hazard. Plenty of room for Jamie to go full metronome and grind out a comeback no one will enjoy. Plenty of room for Josh to keep filing scorecards via interpretive dance. Strap in.`
