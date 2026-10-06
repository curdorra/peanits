export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "aside"; text: string };

export type Article = {
  slug: string;
  title: string;
  category: "Reading" | "Practice" | "History" | "Theory" | "Help";
  blurb: string;
  minutes: number;
  blocks: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "grand-staff",
    title: "Reading the grand staff",
    category: "Reading",
    blurb: "Lines, spaces, clefs and middle C: the map every pianist reads from.",
    minutes: 4,
    blocks: [
      { t: "p", text: "Piano music is written on two staves joined together, called the grand staff. Each staff has five lines and four spaces, and a clef at the start tells you which pitches those lines and spaces stand for." },
      { t: "h2", text: "Two clefs" },
      { t: "p", text: "The treble clef, also called the G clef, curls around the second line from the bottom. That line is the G above middle C. Pianists usually play the treble staff with the right hand." },
      { t: "p", text: "The bass clef, or F clef, has two dots that sit either side of the second line from the top. That line is the F below middle C. The left hand usually reads this staff." },
      { t: "h2", text: "Middle C" },
      { t: "p", text: "Middle C sits between the two staves. In the treble clef it is on a short extra line below the staff; in the bass clef it is on one above the staff. These short extra lines are called ledger lines, and they let a staff reach notes beyond its five lines." },
      { t: "p", text: "Pitches are often named with a number so that octaves can be told apart. In the most common system, middle C is C4, the C above it is C5, and the lowest C on a standard 88-key piano is C1." },
      { t: "h2", text: "The lines and the spaces" },
      { t: "ul", items: [
        "Treble clef lines, from the bottom: E, G, B, D, F (Every Good Boy Does Fine).",
        "Treble clef spaces, from the bottom: F, A, C, E (it spells FACE).",
        "Bass clef lines, from the bottom: G, B, D, F, A (Good Boys Do Fine Always).",
        "Bass clef spaces, from the bottom: A, C, E, G (All Cows Eat Grass).",
      ] },
      { t: "h2", text: "Beyond the mnemonics" },
      { t: "p", text: "Rhymes are a fine way to start, but they are slow when you are reading in real time. Most fluent readers learn a few landmark notes instead: middle C, the treble G, the bass F, and the other Cs. From a landmark you read the neighbouring notes by step (line to space) or by skip (line to line), rather than naming every note." },
      { t: "aside", text: "In peanits, the early units use small groups of notes around middle C so that these landmarks become automatic before the range widens." },
    ],
  },
  {
    slug: "practising-sight-reading",
    title: "How to practise sight-reading",
    category: "Practice",
    blurb: "Habits that make you a better reader, from checking the key to never stopping.",
    minutes: 5,
    blocks: [
      { t: "p", text: "Sight-reading means playing music you have not seen before. It is a skill separate from learning a piece well, and it improves with a particular kind of practice: lots of easy music, played steadily, without stopping." },
      { t: "h2", text: "Before you play" },
      { t: "ul", items: [
        "Look at the key signature and the time signature.",
        "Scan for accidentals, repeated patterns and any tricky rhythms.",
        "Find the first note and decide on your hand position.",
        "Set a tempo slower than feels necessary, and silently count a bar in.",
      ] },
      { t: "h2", text: "While you play" },
      { t: "p", text: "Keep going. If you play a wrong note, carry on and leave it behind; stopping to fix mistakes trains the habit of stopping. Many teachers advise that a wrong note in the right place in time is better than the right note at the wrong moment, because the beat is what holds the music together." },
      { t: "p", text: "Read ahead. Skilled readers look at the music a little way ahead of the notes they are currently playing. Researchers call this the eye–hand span. You can train it by playing slowly and deliberately looking at the next bar before your hands arrive there." },
      { t: "p", text: "Keep your eyes on the page as much as you can. Your hands learn the layout of the keyboard by feel, which frees your eyes to read." },
      { t: "h2", text: "How much, and what" },
      { t: "ul", items: [
        "Little and often: five to ten minutes a day beats an occasional long session.",
        "Choose music a level or two easier than what you can currently play.",
        "Read widely: hymns, simple duets, folk tunes and beginner collections all count.",
        "Count aloud when rhythm is the problem, and clap a passage first if you need to.",
      ] },
      { t: "aside", text: "Note-reading drills and real sight-reading are different exercises. The drills in peanits build the fast note recognition that real reading relies on; passages with rhythm are planned for a later version." },
    ],
  },
  {
    slug: "history-of-the-piano",
    title: "A short history of the piano",
    category: "History",
    blurb: "From Cristofori's gravicembalo around 1700 to the instrument on your desk today.",
    minutes: 6,
    blocks: [
      { t: "p", text: "The piano is a young instrument compared with the keyboards that came before it. Its story is largely the story of musicians wanting to play louder and softer by touch alone." },
      { t: "h2", text: "Before the piano" },
      { t: "p", text: "The harpsichord plucks its strings, and however you press the key the volume barely changes. The clavichord strikes its strings with small metal blades and responds to touch, but it is very quiet. Neither could do what the piano later could: sing out and whisper on the same keyboard." },
      { t: "h2", text: "Cristofori, around 1700" },
      { t: "p", text: "Around the year 1700, Bartolomeo Cristofori, an instrument maker working for the Medici court in Florence, built a keyboard in which hammers struck the strings. He called it a gravicembalo col piano e forte, meaning a harpsichord with soft and loud. Its key feature was an escapement, a mechanism that lets the hammer fall back after striking so the string can keep sounding. Three of his instruments, dated from the 1720s, survive." },
      { t: "h2", text: "The eighteenth century" },
      { t: "p", text: "The idea spread slowly. In Germany, Gottfried Silbermann built pianos influenced by Cristofori's design. In Vienna, makers such as Johann Andreas Stein and Anton Walter built light, clear-toned instruments with a quick action, and Mozart played on pianos of this type. English makers such as Broadwood built heavier, louder instruments." },
      { t: "h2", text: "The nineteenth century" },
      { t: "p", text: "Composers kept asking for more range and more power, and makers responded. Iron frames could take far higher string tension than wood, strings were crossed over one another to fit longer bass strings in the case, and Sébastien Érard's double escapement, patented in 1821, allowed rapid repeated notes. The keyboard grew from about five octaves in Mozart's time to the 88 keys, seven and a quarter octaves, that became standard by the later nineteenth century. Upright pianos made the instrument a fixture of ordinary homes." },
      { t: "h2", text: "The twentieth century and now" },
      { t: "p", text: "Recording, the player piano and the radio changed how piano music was heard. Electric and then digital pianos arrived, and the MIDI standard, introduced in 1983, let keyboards talk to computers. That standard is what allows a web app like this one to read the keys you press." },
      { t: "aside", text: "Dates for the earliest instruments are approximate. Historians still discuss details of Cristofori's work, so treat 'around 1700' as just that." },
    ],
  },
  {
    slug: "eras-of-piano-music",
    title: "Piano music through the eras",
    category: "History",
    blurb: "Baroque, Classical, Romantic and modern: who wrote what, and how it sounds.",
    minutes: 6,
    blocks: [
      { t: "p", text: "Music history is usually divided into periods. The dates are approximate and the edges overlap, but the labels are useful for knowing what to expect from a piece." },
      { t: "h2", text: "Baroque, c. 1600–1750" },
      { t: "p", text: "Baroque keyboard music was written for the harpsichord, organ and clavichord, since the piano barely existed. Pianists play it today on the modern piano all the time. Think of Johann Sebastian Bach (1685–1750), whose Two-Part Inventions are a classic early study in playing independent lines, and Domenico Scarlatti (1685–1757), who wrote over five hundred keyboard sonatas." },
      { t: "h2", text: "Classical, c. 1750–1820" },
      { t: "p", text: "Clarity, balance and form are the hallmarks here, along with the sonata, which became the central structure of the period. Joseph Haydn (1732–1809), Wolfgang Amadeus Mozart (1756–1791) and Ludwig van Beethoven (1770–1827) wrote the central repertoire. Beethoven's career bridges into the next era." },
      { t: "h2", text: "Romantic, c. 1820–1900" },
      { t: "p", text: "Composers turned to personal expression, short character pieces, and virtuosity. Franz Schubert (1797–1828), Frédéric Chopin (1810–1849), Robert Schumann (1810–1856), Franz Liszt (1811–1886) and Johannes Brahms (1833–1897) all wrote major piano works. Flexible timing (rubato) and expressive use of the pedal become part of the style." },
      { t: "h2", text: "Around 1900 and beyond" },
      { t: "p", text: "Claude Debussy (1862–1918) and Maurice Ravel (1875–1937) explored colour and atmosphere. Béla Bartók (1881–1945) and Sergei Prokofiev (1891–1953) brought rhythmic drive and new harmonies. Ragtime, associated with Scott Joplin (c. 1868–1917), and later jazz opened other paths, and John Cage (1912–1992) famously altered the piano itself with objects placed between the strings." },
      { t: "aside", text: "A good habit for a growing reader: play something from each era at your level, so your hands and your ear learn different styles." },
    ],
  },
  {
    slug: "key-signatures",
    title: "Key signatures made simple",
    category: "Theory",
    blurb: "How sharps and flats at the start of a line tell you the key.",
    minutes: 4,
    blocks: [
      { t: "p", text: "A key signature is the group of sharps or flats written at the start of every line. It says: play these notes sharp (or flat) throughout, unless told otherwise. It saves writing the accidental each time and also tells you the home note, or tonic, of the piece." },
      { t: "h2", text: "The order is fixed" },
      { t: "ul", items: [
        "Sharps always appear in this order: F, C, G, D, A, E, B.",
        "Flats appear in the reverse order: B, E, A, D, G, C, F.",
      ] },
      { t: "p", text: "So a signature with two sharps always means F♯ and C♯, and one with two flats always means B♭ and E♭." },
      { t: "h2", text: "Finding the major key" },
      { t: "ul", items: [
        "No sharps or flats: C major (or A minor).",
        "Sharp keys: the last sharp is the seventh note of the scale, so the key is the note a half step above it. One sharp (F♯) means G major; two sharps (F♯, C♯) means D major.",
        "Flat keys: the second-to-last flat names the key. Two flats (B♭, E♭) means B♭ major; three flats means E♭ major. One flat (B♭) is the exception: it means F major.",
      ] },
      { t: "h2", text: "The circle of fifths" },
      { t: "p", text: "If you move up by a fifth from C, you reach G, then D, A, E and so on, adding one sharp each time. Moving down by a fifth adds flats instead. Drawing these keys in a circle gives the circle of fifths, a map you will meet again and again." },
      { t: "aside", text: "Accidentals in peanits are introduced in Grade III as separate notes. Reading a full key signature comes in a later release." },
    ],
  },
  {
    slug: "rhythm-and-time-signatures",
    title: "Rhythm and time signatures",
    category: "Theory",
    blurb: "Note values, beats and how to count what you are reading.",
    minutes: 4,
    blocks: [
      { t: "p", text: "Pitch tells you which key to press; rhythm tells you when, and for how long. Many sight-reading errors are rhythm errors, so it pays to treat the two as equal partners." },
      { t: "h2", text: "Note values" },
      { t: "ul", items: [
        "A whole note lasts four quarter-note beats in 4/4.",
        "A half note lasts two beats, a quarter note one beat, and an eighth note half a beat.",
        "A dot after a note adds half of its value: a dotted half note lasts three beats.",
        "Each note value has a matching rest, which is a silence of the same length.",
      ] },
      { t: "h2", text: "Time signatures" },
      { t: "p", text: "A time signature is two numbers stacked together. The top number says how many beats are in each bar. The bottom number says which kind of note gets one beat: 4 means a quarter note, 8 means an eighth note." },
      { t: "ul", items: [
        "4/4 (also written C, 'common time'): four quarter-note beats per bar.",
        "3/4: three quarter-note beats per bar, the feel of a waltz.",
        "2/4: two quarter-note beats per bar, like a march.",
        "6/8: six eighth notes per bar, usually felt as two beats of three.",
      ] },
      { t: "h2", text: "Counting" },
      { t: "p", text: "In 4/4, count 'one, two, three, four' for the beats and 'and' for the half-beats between them: 'one-and, two-and, three-and, four-and'. Say it aloud while you clap a passage; once the rhythm is secure, add the notes." },
    ],
  },
  {
    slug: "how-peanits-listens",
    title: "How peanits listens to you",
    category: "Help",
    blurb: "Microphone or MIDI keyboard: what each can hear, and how to get the best result.",
    minutes: 3,
    blocks: [
      { t: "p", text: "peanits can check what you play in two ways, and both run entirely in your browser. No audio is recorded or sent anywhere." },
      { t: "h2", text: "Microphone" },
      { t: "p", text: "This works with any piano, acoustic or digital. The app analyses the sound for a single pitch. A few things help:" },
      { t: "ul", items: [
        "Play one note at a time. Chords and two hands at once are not supported yet.",
        "Put your device close to the piano, and keep the room as quiet as you can.",
        "Let each note ring briefly and avoid holding the sustain pedal down between notes, as the old note can linger.",
        "Very low and very high notes are harder to pick up. If a low note is not recognised, try a little harder and closer to the microphone.",
      ] },
      { t: "h2", text: "MIDI keyboard" },
      { t: "p", text: "If you have a digital piano or MIDI keyboard, connect it by USB and choose MIDI in Settings. Notes arrive instantly and exactly, with no guessing, and this is the most accurate way to practise. Web MIDI works in Chrome, Edge, Opera and Firefox, but not in Safari or on iPhones and iPads." },
      { t: "h2", text: "Why timing numbers are approximate" },
      { t: "p", text: "With the microphone, the app needs a few moments of sound to be sure of a pitch, so the response time includes a small delay. Treat times as a way to compare yourself with yourself, not as exact measurements." },
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
