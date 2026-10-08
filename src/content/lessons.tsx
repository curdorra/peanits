import Link from "next/link";
import type { ReactNode } from "react";
import Keyboard from "@/components/Keyboard";
import MiniStaff from "@/components/MiniStaff";
import ChordBuilder from "@/components/learn/ChordBuilder";
import CircleOfFifths from "@/components/learn/CircleOfFifths";
import KeyHunt from "@/components/learn/KeyHunt";
import Listen from "@/components/learn/Listen";
import NoteExplorer from "@/components/learn/NoteExplorer";
import RhythmDemo from "@/components/learn/RhythmDemo";
import ScaleBuilder from "@/components/learn/ScaleBuilder";
import TempoDemo from "@/components/learn/TempoDemo";
import type { QQ } from "@/components/learn/LessonQuiz";
import { makeNote as n } from "@/lib/notes";
import { click, playChord, playNote, playSequence } from "@/lib/sound";

export type Step = { title: string; body: ReactNode; widget?: ReactNode };
export type Lesson = { slug: string; title: string; blurb: string; group: "Reading" | "Rhythm" | "Sound" | "Theory" | "Skills" | "Stories"; steps: Step[]; quiz: QQ[] };

const two = (a: number, b: number) => () => playSequence([a, b], 0.6, { dur: 1 });
const triad = (r: number, minor = false) => [r, r + (minor ? 3 : 4), r + 7];

function pulse(beats: number, bars = 4, spb = 0.45) {
  for (let i = 0; i < beats * bars; i++) {
    const strong = i % beats === 0;
    if (strong) playNote(48, { when: i * spb, dur: 0.5, vel: 0.9 });
    else playChord([60, 64], { when: i * spb, dur: 0.25, vel: 0.3 });
  }
}
function pulse68(bars = 4, spq = 0.22) {
  for (let i = 0; i < 6 * bars; i++) {
    const pos = i % 6;
    if (pos === 0) playNote(48, { when: i * spq, dur: 0.5, vel: 0.9 });
    else if (pos === 3) playNote(55, { when: i * spq, dur: 0.4, vel: 0.6 });
    else playNote(67, { when: i * spq, dur: 0.15, vel: 0.25 });
  }
}
const phrase = [60, 62, 64, 65, 67, 65, 64, 62, 60];
const playPhrase = (vel: number, dur = 0.5, gap = 0.3) => phrase.forEach((m, i) => playNote(m, { when: i * gap, dur, vel }));

export const LESSONS: Lesson[] = [
  {
    slug: "keyboard",
    title: "Finding your way around the keyboard",
    blurb: "Black-key groups, the musical alphabet, and how to find any C in a second.",
    group: "Reading",
    steps: [
      {
        title: "Twos and threes",
        body: "Look at the black keys: they come in groups of two and three, all the way up the piano. They are your map. Without them every white key would look the same.",
        widget: <Keyboard low={48} high={83} labels="none" label="A keyboard to explore" />,
      },
      {
        title: "Finding C",
        body: "C is the white key just to the left of every group of two black keys. Find them all.",
        widget: <KeyHunt pc={0} name="C" />,
      },
      {
        title: "The musical alphabet",
        body: "White keys use just seven letter names, A B C D E F G, and then start again. Moving to the right, the sound goes higher.",
        widget: <Keyboard low={48} high={71} labels="all" label="Keyboard with every white key named" />,
      },
      {
        title: "Finding F",
        body: "F sits just to the left of every group of three black keys. With C and F as anchors, you can find any note quickly.",
        widget: <KeyHunt pc={5} name="F" />,
      },
      {
        title: "Octaves",
        body: "From one C to the next is an octave: eight white notes, or twelve keys counting the black ones. Notes an octave apart share a name and sound alike, one higher.",
        widget: <Listen items={[{ label: "C3, C4, C5", sub: "three Cs, an octave apart", play: () => playSequence([48, 60, 72], 0.6, { dur: 1.2 }) }]} />,
      },
    ],
    quiz: [
      { q: "Which key is just to the left of a pair of black keys?", options: ["C", "D", "F", "B"], answer: "C" },
      { q: "How many different letter names do the white keys use?", options: ["5", "7", "8", "12"], answer: "7" },
      { q: "From one C up to the next C is called…", options: ["a scale", "an octave", "a fifth", "a chord"], answer: "an octave" },
    ],
  },
  {
    slug: "the-staff",
    title: "Notes on the staff",
    blurb: "Lines, spaces, treble and bass clefs. Tap a note to see where it lives.",
    group: "Reading",
    steps: [
      {
        title: "Five lines, four spaces",
        body: "Music is written on a staff of five lines. A note sits either on a line or in a space. The higher it sits on the staff, the higher it sounds. Tap the names to see and hear them.",
        widget: <NoteExplorer notes={[n("e", 0, 4), n("f", 0, 4), n("g", 0, 4), n("a", 0, 4), n("b", 0, 4), n("c", 0, 5), n("d", 0, 5), n("e", 0, 5), n("f", 0, 5)]} />,
      },
      {
        title: "Treble clef lines and spaces",
        body: "In the treble clef the lines, from the bottom, are E G B D F (Every Good Boy Does Fine). The spaces spell F A C E.",
        widget: <NoteExplorer notes={[n("e", 0, 4), n("g", 0, 4), n("b", 0, 4), n("d", 0, 5), n("f", 0, 5)]} />,
      },
      {
        title: "Bass clef lines and spaces",
        body: "In the bass clef the lines are G B D F A (Good Boys Do Fine Always) and the spaces are A C E G (All Cows Eat Grass).",
        widget: <NoteExplorer clef="bass" notes={[n("g", 0, 2), n("b", 0, 2), n("d", 0, 3), n("f", 0, 3), n("a", 0, 3)]} />,
      },
      {
        title: "Steps and skips",
        body: "From a line to the next space is a step: the next letter. From a line to the next line is a skip: one letter missed out. Reading by steps and skips is much faster than naming every note.",
        widget: (
          <Listen
            items={[
              { label: "Steps", sub: "C D E F G", play: () => playSequence([60, 62, 64, 65, 67], 0.35) },
              { label: "Skips", sub: "C E G B D", play: () => playSequence([60, 64, 67, 71, 74], 0.35) },
            ]}
          />
        ),
      },
    ],
    quiz: [
      { q: "The treble clef's spaces spell…", options: ["FACE", "EGBDF", "ACEG", "GBDFA"], answer: "FACE" },
      { q: "In the bass clef, the top line is…", options: ["A", "F", "G", "E"], answer: "A" },
      { q: "Moving from a line to the very next line is a…", options: ["step", "skip", "octave", "slur"], answer: "skip" },
    ],
  },
  {
    slug: "grand-staff",
    title: "Middle C and the grand staff",
    blurb: "How the two staves join up, and five landmark notes that make reading faster.",
    group: "Reading",
    steps: [
      {
        title: "Two staves, one piano",
        body: "Piano music uses two staves joined by a brace: the grand staff. The right hand usually reads the treble clef and the left hand the bass clef.",
      },
      {
        title: "Middle C",
        body: "Middle C sits between the two staves on a short ledger line. Written in either clef, it's the very same key, near the middle of the piano.",
        widget: (
          <div className="row" style={{ justifyContent: "center", width: "100%" }}>
            <div style={{ flex: "1 1 200px", maxWidth: 260 }}><MiniStaff notes={[n("c", 0, 4)]} label="Middle C in the treble clef" width={200} /></div>
            <div style={{ flex: "1 1 200px", maxWidth: 260 }}><MiniStaff clef="bass" notes={[n("c", 0, 4)]} label="Middle C in the bass clef" width={200} /></div>
          </div>
        ),
      },
      {
        title: "Landmark notes",
        body: "Fluent readers learn a few landmarks and read everything else from them: middle C, treble G (the line the treble clef curls around), bass F (between the bass clef's dots), and the Cs in the third space of the treble and the second space of the bass.",
        widget: <NoteExplorer notes={[n("c", 0, 4), n("g", 0, 4), n("c", 0, 5)]} />,
      },
      {
        title: "…and in the bass",
        body: "The bass landmarks: F, the line the clef's two dots surround, and C in the second space.",
        widget: <NoteExplorer clef="bass" notes={[n("f", 0, 3), n("c", 0, 3), n("c", 0, 4)]} />,
      },
      {
        title: "Ledger lines",
        body: "When notes go above or below the staff, short ledger lines extend it. Count them as if the staff carried on.",
        widget: <NoteExplorer notes={[n("a", 0, 3), n("b", 0, 3), n("g", 0, 5), n("a", 0, 5), n("c", 0, 6)]} />,
      },
    ],
    quiz: [
      { q: "Middle C is written on…", options: ["a ledger line", "the top line", "the middle line", "the bottom space"], answer: "a ledger line" },
      { q: "The bass clef's two dots sit either side of which note?", options: ["F", "G", "C", "D"], answer: "F" },
      { q: "Notes above or below the staff are written with…", options: ["ledger lines", "bar lines", "a new clef", "slurs"], answer: "ledger lines" },
    ],
  },
  {
    slug: "sharps-and-flats",
    title: "Sharps, flats and naturals",
    blurb: "Semitones, the black keys, and why one key can have two names.",
    group: "Reading",
    steps: [
      {
        title: "The semitone",
        body: "A semitone is the distance from one key to the very next, black or white. A sharp (♯) raises a note by a semitone, a flat (♭) lowers it by one, and a natural (♮) cancels either.",
        widget: <NoteExplorer notes={[n("f", 0, 4), n("f", 1, 4), n("b", 0, 4), n("b", -1, 4)]} />,
      },
      {
        title: "One key, two names",
        body: "F♯ and G♭ are the same key on the piano. Notes like these are called enharmonic. Which name is used depends on the key of the music.",
        widget: <Listen items={[{ label: "F♯ and G♭", sub: "the same sound", play: two(66, 66) }]} />,
      },
      {
        title: "No black key between",
        body: "Between E and F, and between B and C, there is no black key: they are already a semitone apart.",
        widget: <Keyboard low={60} high={72} labels="all" marks={{ 64: "hint", 65: "hint", 71: "hint", 72: "hint" }} label="Keyboard showing E–F and B–C" />,
      },
      {
        title: "How long does an accidental last?",
        body: "A sharp, flat or natural written in the music lasts until the end of that bar, for that note. Then it's cancelled automatically by the bar line.",
      },
    ],
    quiz: [
      { q: "A sharp…", options: ["raises a note by a semitone", "lowers a note by a semitone", "cancels a flat", "raises a note by a tone"], answer: "raises a note by a semitone" },
      { q: "Which pair has no black key between them?", options: ["E and F", "F and G", "C and D", "A and B"], answer: "E and F" },
      { q: "A written sharp lasts…", options: ["until the end of the bar", "for one note only", "until the end of the piece", "until the next line"], answer: "until the end of the bar" },
    ],
  },
  {
    slug: "note-values",
    title: "How long is a note?",
    blurb: "Semibreves to semiquavers, dots and rests. Press play and count along.",
    group: "Rhythm",
    steps: [
      {
        title: "Halving each time",
        body: "Each note value is half the one before: a semibreve (whole note) lasts four crotchet beats, a minim (half note) two, a crotchet (quarter note) one, and a quaver (eighth note) half a beat.",
        widget: <RhythmDemo time="4/4" bars={[["w"], ["h", "h"], ["q", "q", "q", "q"], ["8", "8", "8", "8", "8", "8", "8", "8"]]} label="Four bars, halving" />,
      },
      {
        title: "Two sets of names",
        body: "British English says semibreve, minim, crotchet, quaver, semiquaver. American English says whole, half, quarter, eighth, sixteenth note. Both are used in exams and books, so it's worth knowing both.",
      },
      {
        title: "Dots",
        body: "A dot after a note adds half its value again. A dotted minim lasts three beats; a dotted crotchet lasts one and a half, and is usually followed by a quaver.",
        widget: <RhythmDemo time="3/4" bars={[["hd"], ["h", "q"], ["qd", "8", "q"], ["hd"]]} label="Dotted notes" />,
      },
      {
        title: "Rests",
        body: "Every note value has a matching rest: a silence of the same length. Rests are counted just as carefully as notes.",
      },
    ],
    quiz: [
      { q: "How many crotchets fit into a minim?", options: ["1", "2", "3", "4"], answer: "2" },
      { q: "A dotted minim lasts…", options: ["2 beats", "3 beats", "4 beats", "1½ beats"], answer: "3 beats" },
      { q: "An eighth note is also called a…", options: ["quaver", "crotchet", "minim", "semiquaver"], answer: "quaver" },
    ],
  },
  {
    slug: "time-signatures",
    title: "Time signatures",
    blurb: "Hear a march, a waltz and a jig, and learn what the two numbers mean.",
    group: "Rhythm",
    steps: [
      {
        title: "Two numbers",
        body: "The top number says how many beats are in each bar. The bottom number says what kind of note gets the beat: 4 means a crotchet, 8 a quaver, 2 a minim.",
      },
      {
        title: "Hear the difference",
        body: "Listen for the strong first beat of each bar.",
        widget: (
          <Listen
            items={[
              { label: "2/4", sub: "two beats: a march", play: () => pulse(2) },
              { label: "3/4", sub: "three beats: a waltz", play: () => pulse(3) },
              { label: "4/4", sub: "four beats: common time", play: () => pulse(4, 3) },
              { label: "6/8", sub: "two beats of three quavers: a jig", play: () => pulse68() },
            ]}
          />
        ),
      },
      {
        title: "Compound time",
        body: "In 6/8 there are six quavers per bar, but they're felt as two beats of three. Times like this are called compound; 9/8 and 12/8 work the same way.",
        widget: <RhythmDemo time="6/8" bars={[["qd", "qd"], ["q", "8", "qd"], ["8", "8", "8", "q", "8"], ["hd"]]} bpm={60} label="6/8" />,
      },
      {
        title: "Counting",
        body: "Count the beats aloud: 1, 2, 3, 4. For quavers in between, say \"and\": 1-and-2-and. In 6/8, count 1-2-3-4-5-6 with weight on 1 and 4.",
      },
    ],
    quiz: [
      { q: "In 3/4 there are…", options: ["three crotchet beats per bar", "three quaver beats per bar", "four beats per bar", "three bars per line"], answer: "three crotchet beats per bar" },
      { q: "6/8 is usually felt in…", options: ["two beats", "three beats", "six beats", "eight beats"], answer: "two beats" },
      { q: "A bottom number of 4 means the beat is a…", options: ["crotchet", "quaver", "minim", "semibreve"], answer: "crotchet" },
    ],
  },
  {
    slug: "tempo",
    title: "Tempo: how fast?",
    blurb: "From Largo to Presto on a metronome, and the words for speeding up and slowing down.",
    group: "Rhythm",
    steps: [
      {
        title: "Italian speed words",
        body: "Composers usually mark the speed with an Italian word. Tap each to hear its typical pace.",
        widget: <TempoDemo />,
      },
      {
        title: "Metronome marks",
        body: "♩ = 60 means sixty crotchet beats a minute: one per second. ♩ = 120 is twice as fast.",
        widget: (
          <Listen
            items={[
              { label: "♩ = 60", play: () => Array.from({ length: 6 }, (_, i) => click(i % 4 === 0, 0.05 + i)) },
              { label: "♩ = 120", play: () => Array.from({ length: 12 }, (_, i) => click(i % 4 === 0, 0.05 + i * 0.5)) },
            ]}
          />
        ),
      },
      {
        title: "Changing speed",
        body: "Accelerando: gradually faster. Ritardando or rallentando: gradually slower. A tempo: back to the original speed. Rubato: a little give and take in the timing, for expression.",
      },
    ],
    quiz: [
      { q: "Andante means…", options: ["at a walking pace", "very fast", "very slowly", "getting faster"], answer: "at a walking pace" },
      { q: "Which is fastest?", options: ["Presto", "Allegro", "Moderato", "Adagio"], answer: "Presto" },
      { q: "Ritardando means…", options: ["gradually slowing down", "gradually getting louder", "back to the first speed", "very short"], answer: "gradually slowing down" },
    ],
  },
  {
    slug: "dynamics",
    title: "Loud and soft, smooth and short",
    blurb: "Dynamics and articulation: the markings that turn notes into music.",
    group: "Sound",
    steps: [
      {
        title: "From pp to ff",
        body: "Piano means soft and forte means loud. Mezzo means moderately. Listen to the same phrase at each level.",
        widget: (
          <Listen
            items={[
              { label: "pp", sub: "pianissimo, very soft", play: () => playPhrase(0.12) },
              { label: "p", sub: "piano, soft", play: () => playPhrase(0.22) },
              { label: "mf", sub: "mezzo forte, moderately loud", play: () => playPhrase(0.5) },
              { label: "ff", sub: "fortissimo, very loud", play: () => playPhrase(1) },
            ]}
          />
        ),
      },
      {
        title: "Getting louder and softer",
        body: "A crescendo (cresc., or an opening hairpin) means gradually louder; a diminuendo or decrescendo (a closing hairpin) means gradually softer.",
        widget: (
          <Listen
            items={[
              { label: "Crescendo", play: () => phrase.forEach((m, i) => playNote(m, { when: i * 0.3, dur: 0.5, vel: 0.12 + i * 0.1 })) },
              { label: "Diminuendo", play: () => phrase.forEach((m, i) => playNote(m, { when: i * 0.3, dur: 0.5, vel: 0.95 - i * 0.1 })) },
            ]}
          />
        ),
      },
      {
        title: "Legato and staccato",
        body: "Legato (often shown by a curved slur) means smooth and joined. Staccato (a dot above or below the note) means short and detached. An accent (>) means emphasise the note.",
        widget: (
          <Listen
            items={[
              { label: "Legato", play: () => playPhrase(0.5, 0.6, 0.3) },
              { label: "Staccato", play: () => playPhrase(0.5, 0.12, 0.3) },
            ]}
          />
        ),
      },
    ],
    quiz: [
      { q: "mf stands for…", options: ["mezzo forte", "molto forte", "mezzo fortissimo", "most forte"], answer: "mezzo forte" },
      { q: "Getting gradually louder is a…", options: ["crescendo", "diminuendo", "ritardando", "staccato"], answer: "crescendo" },
      { q: "Staccato notes are…", options: ["short and detached", "smooth and joined", "very loud", "held longer"], answer: "short and detached" },
    ],
  },
  {
    slug: "major-and-minor",
    title: "Major and minor",
    blurb: "Why some music sounds bright and some sounds dark, and what a relative minor is.",
    group: "Sound",
    steps: [
      {
        title: "Hear it",
        body: "Major chords and scales tend to sound bright and settled; minor ones darker or more wistful. The difference is one note: the third.",
        widget: (
          <Listen
            items={[
              { label: "C major chord", play: () => playChord(triad(60), { dur: 1.8 }) },
              { label: "C minor chord", play: () => playChord(triad(60, true), { dur: 1.8 }) },
              { label: "C major scale", play: () => playSequence([60, 62, 64, 65, 67, 69, 71, 72], 0.3) },
              { label: "C minor scale (harmonic)", play: () => playSequence([60, 62, 63, 65, 67, 68, 71, 72], 0.3) },
            ]}
          />
        ),
      },
      {
        title: "Relative minor",
        body: "Every major key has a relative minor with the same key signature. Its home note is three semitones lower: C major and A minor both have no sharps or flats; G major and E minor both have one sharp.",
        widget: (
          <Listen
            items={[
              { label: "C major", play: () => playChord(triad(60)) },
              { label: "A minor", play: () => playChord(triad(57, true)) },
            ]}
          />
        ),
      },
      {
        title: "Harmonic minor",
        body: "Minor keys often raise the seventh note by a semitone, so it leans up to the home note. In A minor, G becomes G♯. That's why accidentals appear even when the key signature is empty.",
        widget: <Listen items={[{ label: "A harmonic minor", sub: "listen for G♯", play: () => playSequence([57, 59, 60, 62, 64, 65, 68, 69], 0.3) }]} />,
      },
    ],
    quiz: [
      { q: "The relative minor of C major is…", options: ["A minor", "C minor", "E minor", "D minor"], answer: "A minor" },
      { q: "Major and minor chords differ in their…", options: ["third", "root", "fifth", "octave"], answer: "third" },
      { q: "In A harmonic minor, G becomes…", options: ["G♯", "G♭", "F♯", "A♭"], answer: "G♯" },
    ],
  },
  {
    slug: "intervals",
    title: "Intervals, and the tunes that remember them",
    blurb: "Count the distance between two notes, and learn each by a melody you already know.",
    group: "Theory",
    steps: [
      {
        title: "Counting intervals",
        body: "An interval is the distance between two notes. Count the letter names, including both ends: C to E is a 3rd (C, D, E); C to G is a 5th.",
        widget: <NoteExplorer notes={[n("c", 0, 4), n("e", 0, 4), n("g", 0, 4), n("c", 0, 5)]} />,
      },
      {
        title: "Tunes that help",
        body: "Musicians remember intervals by the opening notes of famous tunes. Tap to hear each interval.",
        widget: (
          <Listen
            items={[
              { label: "Minor 2nd", sub: "Für Elise (falling)", play: two(76, 75) },
              { label: "Major 2nd", sub: "Frère Jacques", play: two(60, 62) },
              { label: "Minor 3rd", sub: "Greensleeves", play: two(57, 60) },
              { label: "Major 3rd", sub: "When the Saints Go Marching In", play: two(60, 64) },
              { label: "Perfect 4th", sub: "Here Comes the Bride", play: two(60, 65) },
              { label: "Perfect 5th", sub: "Twinkle, Twinkle (first to third note)", play: two(60, 67) },
              { label: "Major 6th", sub: "My Bonnie Lies over the Ocean", play: two(55, 64) },
              { label: "Octave", sub: "Somewhere over the Rainbow", play: two(60, 72) },
            ]}
          />
        ),
      },
      {
        title: "Major, minor, perfect",
        body: "Intervals also have a quality. 2nds, 3rds, 6ths and 7ths are major or minor; 4ths, 5ths and octaves are perfect. A minor interval is one semitone smaller than a major one.",
      },
    ],
    quiz: [
      { q: "C up to G is a…", options: ["5th", "4th", "6th", "3rd"], answer: "5th" },
      { q: "D up to F is a…", options: ["3rd", "2nd", "4th", "5th"], answer: "3rd" },
      { q: "Which tune begins with a perfect 4th?", options: ["Here Comes the Bride", "Twinkle, Twinkle", "Frère Jacques", "Greensleeves"], answer: "Here Comes the Bride" },
    ],
  },
  {
    slug: "circle-of-fifths",
    title: "Key signatures and the circle of fifths",
    blurb: "The order of sharps and flats, and a wheel that holds every key.",
    group: "Theory",
    steps: [
      {
        title: "A fixed order",
        body: "Sharps are always added in the order F C G D A E B. Flats are the same order backwards: B E A D G C F. So two sharps are always F♯ and C♯, and two flats are always B♭ and E♭.",
      },
      {
        title: "The circle",
        body: "Going round clockwise, each key is a fifth higher and has one more sharp; anticlockwise, one more flat. The inner ring shows each relative minor. Tap any key.",
        widget: <CircleOfFifths />,
      },
      {
        title: "Naming the key quickly",
        body: "Sharp keys: the major key is a semitone above the last sharp. Flat keys: the major key is the second-to-last flat (F major, with one flat, is the exception to remember).",
      },
    ],
    quiz: [
      { q: "Two sharps (F♯, C♯) is the key of…", options: ["D major", "G major", "A major", "B♭ major"], answer: "D major" },
      { q: "The first flat is always…", options: ["B♭", "E♭", "F♭", "A♭"], answer: "B♭" },
      { q: "Going clockwise round the circle adds one…", options: ["sharp", "flat", "octave", "beat"], answer: "sharp" },
    ],
  },
  {
    slug: "scales",
    title: "Scales: tones and semitones",
    blurb: "Build any major scale from one pattern, and start with good fingering.",
    group: "Theory",
    steps: [
      {
        title: "The major scale pattern",
        body: "A major scale climbs in tones (T, two semitones) and semitones (S): T T S T T T S. Tap any key to build the scale from it.",
        widget: <ScaleBuilder />,
      },
      {
        title: "Why scales matter",
        body: "Scales train your fingers for the patterns most music is made of, and teach the geography of each key. That's why every exam board asks for them.",
      },
      {
        title: "Fingering C major",
        body: "In the right hand going up, a common fingering is 1 2 3, thumb under, 1 2 3 4 5. In the left hand going up: 5 4 3 2 1, then 3 crosses over, 3 2 1. Your teacher may suggest variations; what matters is using the same fingering every time.",
      },
    ],
    quiz: [
      { q: "The major scale pattern is…", options: ["T T S T T T S", "T S T T S T T", "T T T S T T S", "S T T T S T T"], answer: "T T S T T T S" },
      { q: "In C major, the semitones fall between…", options: ["E–F and B–C", "C–D and G–A", "D–E and A–B", "F–G and C–D"], answer: "E–F and B–C" },
      { q: "In a right-hand C major scale, the thumb usually tucks under after finger…", options: ["3", "2", "4", "5"], answer: "3" },
    ],
  },
  {
    slug: "chords",
    title: "Chords, triads and cadences",
    blurb: "Build triads on the keyboard, and hear how phrases end.",
    group: "Theory",
    steps: [
      {
        title: "Triads",
        body: "A triad is three notes stacked in thirds: a root, a third and a fifth. Tap any key to build a chord on it, and switch between major and minor.",
        widget: <ChordBuilder />,
      },
      {
        title: "Chords I, IV and V",
        body: "Number the chords by the scale note they start on. In C major, I is C, IV is F and V is G. These three harmonise a huge amount of music.",
        widget: (
          <Listen
            items={[
              { label: "I – IV – V – I in C", play: () => [triad(60), triad(65), triad(67), triad(60)].forEach((c, i) => playChord(c, { when: i * 0.9, dur: 1.1 })) },
            ]}
          />
        ),
      },
      {
        title: "Cadences",
        body: "A cadence is the chord pair at the end of a phrase, like punctuation. ABRSM's aural tests ask you to recognise them from Grade 6.",
        widget: (
          <Listen
            items={[
              { label: "Perfect", sub: "V–I: a full stop", play: () => [triad(67), triad(60)].forEach((c, i) => playChord(c, { when: i * 1, dur: 1.4 })) },
              { label: "Imperfect", sub: "ends on V: a comma", play: () => [triad(60), triad(67)].forEach((c, i) => playChord(c, { when: i * 1, dur: 1.4 })) },
              { label: "Plagal", sub: "IV–I: the 'Amen'", play: () => [triad(65), triad(60)].forEach((c, i) => playChord(c, { when: i * 1, dur: 1.4 })) },
              { label: "Interrupted", sub: "V–vi: a surprise", play: () => [triad(67), triad(57, true)].forEach((c, i) => playChord(c, { when: i * 1, dur: 1.4 })) },
            ]}
          />
        ),
      },
    ],
    quiz: [
      { q: "A triad is built from a root, a 3rd and a…", options: ["5th", "4th", "6th", "7th"], answer: "5th" },
      { q: "In C major, chord V is…", options: ["G major", "F major", "A minor", "E minor"], answer: "G major" },
      { q: "A plagal cadence is…", options: ["IV–I", "V–I", "I–V", "V–vi"], answer: "IV–I" },
    ],
  },
  {
    slug: "how-to-sight-read",
    title: "How to sight-read",
    blurb: "What to look for in the 30 seconds before you play, and how to keep going.",
    group: "Skills",
    steps: [
      {
        title: "Before you play",
        body: "Use your preparation time. Check the key signature and the time signature. Find the highest and lowest notes, and any accidentals. Spot patterns: scales, repeated rhythms, broken chords. Choose a steady speed you can keep.",
      },
      {
        title: "Keep going",
        body: "If a note goes wrong, leave it and carry on. In an exam the pulse and the shape of the music matter more than a single note. Practising without stopping builds the habit.",
      },
      {
        title: "Look ahead",
        body: "Good sight-readers keep their eyes a little ahead of their hands. Researchers call this the eye–hand span. Play slowly enough that you can read the next note before you need it.",
      },
      {
        title: "A little every day",
        body: "Five minutes of sight-reading a day does more than an hour once a week. Choose music easier than your pieces, so that you can keep going.",
        widget: (
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn solid" href="/practice/sight-reading"><span>Try a melody now</span></Link>
          </div>
        ),
      },
    ],
    quiz: [
      { q: "If you play a wrong note while sight-reading…", options: ["keep going", "stop and fix it", "start again", "slow down a lot"], answer: "keep going" },
      { q: "Before you start, it's most useful to check…", options: ["the key and time signatures", "the composer's dates", "the page number", "the fingering only"], answer: "the key and time signatures" },
      { q: "Good sight-readers look…", options: ["a little ahead of what they're playing", "at their hands", "only at the first bar", "at the last bar first"], answer: "a little ahead of what they're playing" },
    ],
  },
  {
    slug: "the-first-piano",
    title: "The day the harpsichord learned to whisper",
    blurb: "Why 'piano' is short for 'soft-loud', and the Florentine who invented it.",
    group: "Stories",
    steps: [
      {
        title: "A problem with the harpsichord",
        body: "In 1700 the best keyboard instrument was the harpsichord. It has a bright, beautiful sound, but its strings are plucked, and no matter how hard or softly you press a key, the sound is almost exactly the same. You couldn't shape a phrase with your fingers.",
        widget: <Listen items={[{ label: "Press gently", sub: "what a harpsichord can't do", play: () => playChord([60, 64, 67], { vel: 0.2, dur: 1.4 }) }, { label: "Press firmly", sub: "…and now with weight", play: () => playChord([60, 64, 67], { vel: 0.95, dur: 1.4 }) }]} />,
      },
      {
        title: "Florence, around 1700",
        body: "At the court of the Medici in Florence, an instrument maker named Bartolomeo Cristofori built a keyboard in which little hammers struck the strings and then fell back. A harder press made a louder note; a gentle press, a softer one. A court inventory of 1700 describes a new keyboard 'that has soft and loud'.",
      },
      {
        title: "A name that says it all",
        body: "He called it a 'gravicembalo col piano e forte': a harpsichord with soft and loud. Over time the name shrank to 'pianoforte', and then 'piano'. When you play one gently or with weight, you are doing exactly what he wanted to make possible. The oldest surviving piano, built in 1720, is in a New York museum.",
      },
      {
        title: "Growing bigger",
        body: "The first pianos had around 49 keys. Composers kept asking for more notes, and makers made the instrument louder and stronger. By the late 1800s pianos had 88 keys, from A at the bottom to C at the top, which is why almost every modern piano looks the same.",
      },
    ],
    quiz: [
      { q: "What could the new piano do that a harpsichord could not?", options: ["Vary loudness by touch", "Play higher notes", "Sound with no strings", "Play without keys"], answer: "Vary loudness by touch" },
      { q: "What does 'piano' mean in Italian music?", options: ["Soft", "Loud", "Fast", "Slow"], answer: "Soft" },
      { q: "How many keys does a modern full-size piano have?", options: ["88", "76", "61", "100"], answer: "88" },
    ],
  },
  {
    slug: "beethoven-and-the-silence",
    title: "Beethoven and the silence",
    blurb: "A composer who lost his hearing, and wrote his greatest music anyway.",
    group: "Stories",
    steps: [
      {
        title: "A young star in Vienna",
        body: "Beethoven grew up in Bonn and moved to Vienna in 1792. Within a few years he was admired as a brilliant pianist and a daring composer. Then, in his late twenties, he began to hear a ringing in his ears, and sounds grew harder to make out.",
      },
      {
        title: "A letter he never sent",
        body: "In October 1802, in a village called Heiligenstadt outside Vienna, he wrote a long letter to his brothers. He admitted how much he had hidden his deafness out of shame, that he had thought of ending his life, and that it was his art that held him back: he felt he could not leave the world until he had brought out what was in him. The letter was found after his death.",
      },
      {
        title: "Writing in silence",
        body: "He did not stop. In his last years he could not hear conversation at all, and friends wrote what they wanted to say in 'conversation books', which still survive. His late piano sonatas and quartets, and the Ninth Symphony of 1824, were composed almost entirely in his head.",
      },
      {
        title: "A tune to take away",
        body: "This famous piano piece, 'Für Elise', was not published in his lifetime. It was found and printed in 1867, forty years after he died. Listen to how a tiny, simple idea can say a lot.",
        widget: <Listen items={[{ label: "Für Elise", sub: "the opening", play: () => playSequence([76, 75, 76, 75, 76, 71, 74, 72, 69], 0.3, { dur: 0.45 }) }]} />,
      },
    ],
    quiz: [
      { q: "What did Beethoven write in 1802 at Heiligenstadt?", options: ["A letter about his deafness", "A symphony", "A piano method", "A will for his piano"], answer: "A letter about his deafness" },
      { q: "How did friends talk with him when he could no longer hear?", options: ["They wrote in conversation books", "They played notes", "They sang", "They used signs only"], answer: "They wrote in conversation books" },
      { q: "When was 'Für Elise' first published?", options: ["After Beethoven died", "In 1802", "At its premiere", "Before he went deaf"], answer: "After Beethoven died" },
    ],
  },
  {
    slug: "clara-and-robert",
    title: "Clara and Robert",
    blurb: "A child prodigy, a stubborn father and a love story that ended up in court.",
    group: "Stories",
    steps: [
      {
        title: "A prodigy",
        body: "Clara Wieck was born in Leipzig in 1819. Her father, Friedrich, a famous piano teacher, trained her from early childhood, and by her teens she was a celebrated pianist, touring Europe. She was among the first to play in public from memory.",
      },
      {
        title: "A lodger and a duet",
        body: "A young law student named Robert Schumann came to lodge in the Wiecks' house to study piano with her father. He was nine years older than Clara. As she grew up, the friendship became love.",
      },
      {
        title: "'No'",
        body: "Her father forbade the marriage and did everything he could to stop it. The couple took him to court, and the court ruled that they could marry. The wedding took place on 12 September 1840, the day before Clara's twenty-first birthday.",
      },
      {
        title: "Music from the marriage",
        body: "Robert wrote his 'year of song' in 1840, more than a hundred songs, many of them for Clara. They had eight children. When Robert died in 1856 Clara, then thirty-six, went back on the road to support the family and kept his music alive for the rest of her life.",
        widget: <Listen items={[{ label: "A tune to dream on", sub: "a simple rising phrase", play: () => playSequence([65, 69, 72, 71, 69, 67, 65], 0.5, { dur: 0.8 }) }]} />,
      },
    ],
    quiz: [
      { q: "What did Clara's father do when they wanted to marry?", options: ["Tried to stop it, so they went to court", "Gave a big party", "Moved to another country", "Offered Robert a job"], answer: "Tried to stop it, so they went to court" },
      { q: "What was unusual about Clara's public playing?", options: ["She often played from memory", "She played in the dark", "She only played her own music", "She never played Bach"], answer: "She often played from memory" },
      { q: "What did Clara do after Robert's death?", options: ["Toured and taught to support the family", "Stopped playing", "Became a conductor", "Moved to Italy"], answer: "Toured and taught to support the family" },
    ],
  },
  {
    slug: "joplin-slow-down",
    title: "Joplin says: slow down",
    blurb: "The ragtime king who wrote 'never play ragtime fast'.",
    group: "Stories",
    steps: [
      {
        title: "A small town, a big hit",
        body: "Scott Joplin lived in Sedalia, Missouri, where he played in clubs and taught young pianists. In 1899 a local publisher printed his 'Maple Leaf Rag', named for a Sedalia club. It sold in great numbers, and Joplin became the best-known name in ragtime.",
      },
      {
        title: "The rule on the page",
        body: "Ragtime sounds quick and jaunty, but Joplin wrote a firm instruction on his scores: ragtime should never be played fast. The charm of the music is in the steady left-hand beat against the syncopated right hand, and if you hurry, it falls apart.",
        widget: <TempoDemo />,
      },
      {
        title: "A different dream",
        body: "Joplin hoped ragtime could be serious art. He wrote an opera, Treemonisha, which he struggled to get staged, and he died in 1917, long before it was properly performed. Interest in his music revived after the film The Sting (1973) used it, and in 1976 he was awarded a special Pulitzer Prize.",
      },
    ],
    quiz: [
      { q: "What did Joplin write about playing speed?", options: ["Ragtime should never be played fast", "Play as fast as you can", "Always speed up at the end", "Speed doesn't matter"], answer: "Ragtime should never be played fast" },
      { q: "Which famous piece of his was published in 1899?", options: ["Maple Leaf Rag", "The Entertainer", "Treemonisha", "The Sting"], answer: "Maple Leaf Rag" },
      { q: "What did Joplin write as a serious ambition?", options: ["An opera", "A symphony", "A ballet", "A hymn book"], answer: "An opera" },
    ],
  },
  {
    slug: "florence-price-found",
    title: "The music in the abandoned house",
    blurb: "How Florence Price's lost manuscripts were found, and why it matters.",
    group: "Stories",
    steps: [
      {
        title: "A symphony in Chicago",
        body: "Florence Price was born in Little Rock, Arkansas, in 1887, and studied at the New England Conservatory in Boston. In 1927 she moved to Chicago. In 1933 the Chicago Symphony Orchestra played her Symphony in E minor, the first symphony by a Black woman to be performed by a major American orchestra.",
      },
      {
        title: "Forgotten",
        body: "Price wrote symphonies, concertos, songs, organ and piano music. But after she died in 1953, much of it dropped out of sight. For decades many of her pieces were not played or even in print.",
      },
      {
        title: "A house, a discovery",
        body: "In 2009 a couple renovating an abandoned house outside Chicago found boxes of papers in it. They were Florence Price's manuscripts, among them two violin concertos and a symphony. Orchestras and pianists around the world have since been playing and recording her music.",
      },
      {
        title: "Try her music",
        body: "Some of her piano pieces, such as 'The Goblin and the Mosquito' and 'Daisies: Waltz', appear on exam lists. The stories behind a piece can change how you play it.",
        widget: (
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn solid" href="/learn/composers/price"><span>Meet Florence Price</span></Link>
          </div>
        ),
      },
    ],
    quiz: [
      { q: "Where were Florence Price's manuscripts found in 2009?", options: ["In an abandoned house", "In a library", "At a concert hall", "In a museum"], answer: "In an abandoned house" },
      { q: "What was special about her 1933 performance?", options: ["A major US orchestra played a symphony by a Black woman for the first time", "It was her first concert", "It was her last symphony", "It was broadcast across Europe"], answer: "A major US orchestra played a symphony by a Black woman for the first time" },
      { q: "Where did she move in 1927?", options: ["Chicago", "Boston", "New York", "Paris"], answer: "Chicago" },
    ],
  },
];

export const lessonBySlug = (s: string) => LESSONS.find((l) => l.slug === s);
