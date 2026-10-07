// Piano grade exams: ABRSM and Trinity College London.
// Sources (checked October 2026):
// - ABRSM Piano Practical Grades Qualification Specification 2027 & 2028 (valid 1 Jan 2027 – 31 Dec 2028)
// - Trinity College London Piano Syllabus, graded exams from 2023, and Trinity's per-grade repertoire lists
// Repertoire below is a selection of classical pieces by composers whose music is now generally in the
// public domain. Each board's full list is linked from every grade page.

export type BoardId = "abrsm" | "trinity";

export type Piece = { composer: string; title: string; list?: "A" | "B" | "C" };

export type GradeInfo = {
  id: string; // "initial" | "1" … "8"
  name: string;
  level: number; // 0 = Initial … 8
  about: string; // what a pianist at this level is typically working on (our words)
  sightReading: string[]; // ABRSM: what is new at this grade. Trinity: general notes.
  scales: string[];
  aural?: string[];
  pieces: Piece[];
  minutes?: number; // ABRSM approximate exam length
  hours?: number; // Trinity total qualification time
};

export type Board = {
  id: BoardId;
  name: string;
  fullName: string;
  blurb: string;
  syllabus: string;
  validity: string;
  marks: { part: string; max: number }[];
  total: number;
  results: { label: string; range: string }[];
  facts: string[];
  sightReadingNote: string;
  officialUrl: string;
  repertoireUrl: string;
  grades: GradeInfo[];
};

const GRADE_NAMES = ["Initial", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const IDS = ["initial", "1", "2", "3", "4", "5", "6", "7", "8"];

// Shared, board-neutral descriptions of each level.
const ABOUT = [
  "First pieces with each hand in a five-finger position. Reading notes around middle C, simple rhythms, loud and soft.",
  "Hands begin to work together. Simple keys with one sharp or flat, steady pulse in two, three and four time.",
  "Hands together more often, small changes of hand position, tied notes and dotted rhythms. Keys up to two sharps or flats.",
  "Moving freely around the keyboard, two-note chords, the first semiquavers. Expression starts to matter as much as the notes.",
  "Compound time (6/8), upbeats and chromatic notes. Pieces get longer and the style of each period begins to show.",
  "A real milestone. Four-part chords, syncopation, keys up to four sharps or flats, and a wide range of musical character.",
  "Pedalling, clef changes and triplets. Pieces from every era, played with genuine control of tone and shape.",
  "Advanced repertoire: Bach dances and inventions, sonata movements, Romantic character pieces, and music of the twentieth century.",
  "The top of the graded exams. Full sonata movements, preludes and fugues, nocturnes; a performer's command of the instrument.",
];

/* ---------------- ABRSM ---------------- */

const ABRSM_SR: string[][] = [
  [
    "Length: 4 bars, in 4/4",
    "Keys: C major, D minor",
    "Each hand separately, in a five-finger position (tonic to dominant)",
    "Legato phrases and staccato; f and p",
  ],
  [
    "Time: 2/4 and 3/4 as well as 4/4",
    "New keys: G and F major, A minor",
    "Any five-finger position",
    "Occasional accidentals (in minor keys only)",
    "Slurs and accents; mf and mp; crescendo and diminuendo hairpins",
  ],
  [
    "New keys: D major, E and G minor",
    "Hands playing together",
    "Dotted crotchet–quaver patterns and tied notes",
    "pp",
  ],
  [
    "Length: up to 8 bars",
    "New time: 3/8",
    "New keys: A, B♭ and E♭ major, B minor",
    "Hands move outside a five-finger position",
    "Two-note chords in either hand; simple semiquaver patterns",
  ],
  ["Length: about 8 bars", "New time: 6/8", "Anacrusis (upbeat start)", "Chromatic notes", "Pause signs and tenuto"],
  [
    "Length: about 8–12 bars",
    "New keys: E and A♭ major, F♯ and C minor",
    "Four-part chords (two notes at most in either hand)",
    "Simple syncopation; slowing of tempo at the end",
    "ff",
  ],
  ["Length: about 12–16 bars", "New times: 9/8, 5/8, 5/4", "New keys: C♯ and F minor", "Triplet rhythms", "Clef changes", "Use of the right (sustaining) pedal"],
  ["Length: about 16–20 bars", "New times: 7/8, 7/4", "Tempo changes", "8va sign", "Use of the una corda pedal"],
  ["Length: about a page", "New time: 12/8", "New keys: B and D♭ major", "Three-part chords in either hand", "Spread chords and simple ornaments", "Accelerando"],
];

const ABRSM_SCALES: string[][] = [
  [
    "C major and D minor scales: one octave, hands separately",
    "C major contrary-motion scale: a fifth",
    "C major and D minor arpeggios: a fifth (the first five notes), hands separately",
  ],
  [
    "C major scale: one octave, hands together",
    "G and F major; A and D minor scales: two octaves, hands separately",
    "C major contrary-motion scale: one octave",
    "G major and A minor arpeggios: one octave, hands separately",
  ],
  [
    "G and F major; A and D minor scales: two octaves, hands together",
    "D and A major; E and G minor scales: two octaves, hands separately",
    "C major contrary-motion scale: two octaves",
    "Chromatic scale starting on D: one octave, hands separately",
    "D and A major; E and G minor arpeggios: two octaves, hands separately",
  ],
  [
    "D and A major; E and G minor scales: two octaves, hands together",
    "B♭ and E♭ major; B and C minor scales: two octaves, hands separately",
    "E major contrary-motion scale: two octaves",
    "Chromatic contrary-motion scale starting on D: one octave",
    "Arpeggios in the same keys (hands together for D, A, E, G; separately for B♭, E♭, B, C)",
  ],
  [
    "B♭ and E♭ major; B and C minor scales: two octaves, hands together",
    "B, F♯ and A♭ major; F♯ and F minor scales: two octaves, hands separately",
    "E♭ major and C harmonic minor contrary-motion scales: two octaves",
    "Chromatic scale starting on F♯: two octaves, hands together",
    "Arpeggios in the same keys",
  ],
  [
    "A, E, B, F♯ and D♭ major; F♯, C♯, G♯, E♭ and B♭ minor scales: two octaves, legato, hands together",
    "A♭ major and F minor scales: two octaves, staccato, hands separately",
    "D♭ major and C♯ harmonic minor contrary-motion scales",
    "Chromatic contrary-motion scale starting a major third apart (F♯ and A♯)",
    "Arpeggios: A, E, B, F♯, A♭, D♭ major; F♯, C♯, G♯, E♭, F, B♭ minor, hands together",
    "Diminished seventh starting on B: two octaves, hands separately",
  ],
  [
    "D, F, A♭ and B major; D, F, G♯ and B minor scales (harmonic and melodic): four octaves, legato or staccato",
    "Contrary-motion scales in the same keys: two octaves",
    "Chromatic scales starting on G♯ and B: four octaves",
    "Arpeggios in the same keys: four octaves, root position",
    "Dominant sevenths in D, F, A♭ and B; diminished sevenths on G♯ and B",
  ],
  [
    "D♭, E, G and B♭ major; C♯, E, G and B♭ minor scales: four octaves, legato or staccato",
    "Scales a third apart and contrary-motion scales in the same keys",
    "G major scale in thirds: legato and staccato, hands separately",
    "Chromatic contrary-motion scale starting a minor third apart (C♯ and E)",
    "Arpeggios in first inversion; dominant sevenths in D♭, E, G and B♭; diminished sevenths on B♭ and E",
  ],
  [
    "C, E♭, F♯ and A major and minor scales: four octaves, legato or staccato",
    "Scales a sixth apart and contrary-motion scales in the same keys",
    "E♭ major legato scale in thirds; C major staccato scale in sixths",
    "Chromatic scale a major sixth apart; whole-tone scales starting on E♭ and C",
    "Arpeggios in second inversion; dominant sevenths in C, E♭, F♯ and A",
  ],
];

const ABRSM_AURAL: string[][] = [
  ["Clap the pulse of a piece", "Clap back the rhythm of two short phrases", "Sing back two one-bar phrases", "Say whether a piece is loud or quiet, or smooth or detached"],
  ["Clap the pulse and say whether it is in two or three time", "Sing back three short phrases", "Spot where a note changes in a phrase", "Answer about dynamics and articulation"],
  ["Clap the pulse (two or three time)", "Sing back three phrases, up to the dominant", "Spot a change of pitch or rhythm", "Answer about dynamics or articulation, and tempo"],
  ["Clap the pulse (two, three or four time)", "Sing back phrases within an octave, major or minor", "Spot a change of pitch or rhythm in a longer phrase", "Say whether a piece is major or minor"],
  ["Sing or play back a melody from memory", "Sight-sing five notes", "Describe the character of a piece", "Clap the rhythm of an extract and name the time"],
  ["Sing or play back a melody from memory", "Sight-sing six notes", "Describe the style and period of a piece", "Clap the rhythm of an extract and name the time"],
  ["Sing or play back the upper part of a two-part phrase", "Sing a melody from the score with accompaniment", "Name a cadence: perfect or imperfect", "Talk about texture or structure"],
  ["Sing or play back the lower part of a two-part phrase", "Name a cadence and its two chords", "Recognise a modulation to the dominant, subdominant or relative minor", "Clap a rhythm, including 6/8"],
  ["Sing or play back the lowest part of a three-part phrase", "Name a cadence, including plagal, and its three chords with their positions", "Sing the lower part of a two-part phrase from the score"],
];

const ABRSM_PIECES: Piece[][] = [
  [
    { composer: "Alexander Reinagle", title: "Allegretto (No. 9 from 24 Short and Easy Pieces, Op. 1)", list: "A" },
    { composer: "Cornelius Gurlitt", title: "Dance (No. 2 from Das kleine Konzert, Op. 227)", list: "A" },
  ],
  [
    { composer: "Ludwig van Beethoven", title: "German Dance in C (from 12 German Dances, WoO 8)", list: "A" },
    { composer: "Muzio Clementi", title: "Arietta in C (Lesson Five from Op. 42)", list: "A" },
    { composer: "William Duncombe", title: "Minuet in C (from First Book of Progressive Lessons)", list: "A" },
    { composer: "Cornelius Gurlitt", title: "The Chase (No. 15 from First Lessons for the Piano, Op. 117)", list: "A" },
    { composer: "James Hook", title: "Gavotte in C (No. 3 from 24 Progressive Lessons, Op. 81)", list: "A" },
    { composer: "Leopold Mozart", title: "Minuet in F (No. 6 from the Notebook for Nannerl)", list: "A" },
    { composer: "Fritz Spindler", title: "Song without Words", list: "B" },
  ],
  [
    { composer: "Henry Purcell", title: "The Queen's Dolour, Z. 670", list: "A" },
    { composer: "Christian Petzold", title: "Minuet No. 2 in G minor (from the Notebook for Anna Magdalena Bach, 1725)", list: "A" },
    { composer: "Mel Bonis", title: "Madrigal (from Album pour les tout-petits, Op. 103)", list: "A" },
    { composer: "Wolfgang Amadeus Mozart", title: "Minuet in D, K. 7", list: "A" },
    { composer: "Henry Purcell", title: "Air in D minor, Z. T676", list: "A" },
    { composer: "Béla Bartók", title: "Sorrow (No. 7 from For Children, Vol. 2)", list: "B" },
    { composer: "Fritz Spindler", title: "Waltz in A minor", list: "B" },
  ],
  [
    { composer: "Wolfgang Amadeus Mozart", title: "Minuet in F, K. 5", list: "A" },
    { composer: "Leopold Mozart", title: "Angloise (from the Notebook for Wolfgang)", list: "A" },
    { composer: "Wolfgang Amadeus Mozart", title: "Allegro in B♭, K. 3", list: "A" },
    { composer: "Carl Reinecke", title: "Vivace (4th movt from Sonatina in A minor, Op. 136 No. 4)", list: "A" },
    { composer: "Franz Schubert", title: "German Dance in A (No. 3 from Drei Deutsche, D. 972)", list: "A" },
    { composer: "Robert Schumann", title: "The Wild Horseman (No. 8 from Album for the Young, Op. 68)", list: "A" },
    { composer: "Cornelius Gurlitt", title: "Song, Op. 172 No. 1", list: "B" },
    { composer: "Pyotr Ilyich Tchaikovsky", title: "Chanson italienne (No. 15 from Album for the Young, Op. 39)", list: "B" },
    { composer: "Florence Price", title: "Daisies: Waltz (No. 3 from In Summer Fields)", list: "C" },
  ],
  [
    { composer: "Domenico Scarlatti", title: "Minuet (2nd movt from Sonata in A, Kp. 83)", list: "A" },
    { composer: "Johann Christoph Friedrich Bach", title: "Scherzo (from Musikalische Nebenstunden)", list: "A" },
    { composer: "Ludwig van Beethoven", title: "Allegro assai (1st movt from Sonatina in F, Anh. 5 No. 2)", list: "A" },
    { composer: "Edvard Grieg", title: "Elfin Dance (No. 4 from Lyric Pieces, Op. 12)", list: "A" },
    { composer: "Stephen Heller", title: "Study in A minor, Op. 45 No. 2", list: "A" },
    { composer: "Wolfgang Amadeus Mozart", title: "Rondo in F, K. 15hh", list: "A" },
    { composer: "Enrique Granados", title: "Dedicatoria (No. 1 from Cuentos de la juventud, Op. 1)", list: "B" },
    { composer: "Franz Liszt", title: "La cloche sonne, S. 238", list: "B" },
    { composer: "Florence Price", title: "The Goblin and the Mosquito", list: "C" },
  ],
  [
    { composer: "Franz Schubert", title: "Minuet and Trio in B♭ (No. 10 from 20 Minuets, D. 41)", list: "A" },
    { composer: "Anton Diabelli", title: "Rondo (3rd movt from Sonatina in F, Op. 168 No. 1)", list: "A" },
    { composer: "Johann Sebastian Bach", title: "Invention No. 8 in F, BWV 779", list: "A" },
    { composer: "Ludwig van Beethoven", title: "Bagatelle in G minor, Op. 119 No. 1", list: "A" },
    { composer: "Cécile Chaminade", title: "Gavotte (No. 5 from Album des enfants, Op. 123)", list: "A" },
    { composer: "Joseph Haydn", title: "Allegro (1st movt from Sonata in G, Hob. XVI:G1)", list: "A" },
    { composer: "Friedrich Kuhlau", title: "Allegro con spirito (1st movt from Sonatina in C, Op. 55 No. 3)", list: "A" },
    { composer: "Wolfgang Amadeus Mozart", title: "Theme, Var. 1 and Var. 5 (from 12 Variations on 'Ah vous dirai-je, maman', K. 265)", list: "A" },
    { composer: "Robert Schumann", title: "Of Foreign Lands and Peoples (No. 1 from Kinderszenen, Op. 15)", list: "B" },
    { composer: "Pyotr Ilyich Tchaikovsky", title: "Song of the Lark (No. 22 from Album for the Young, Op. 39)", list: "B" },
    { composer: "Béla Bartók", title: "Winter Solstice Song (No. 38 from For Children, Vol. 1)", list: "C" },
  ],
  [
    { composer: "Wolfgang Amadeus Mozart", title: "Allegro (1st movt from Sonata in C, K. 545)", list: "A" },
    { composer: "Frédéric Chopin", title: "Polonaise in G minor, KK IIa No. 1", list: "A" },
    { composer: "Carl Philipp Emanuel Bach", title: "Solfeggietto in C minor, Wq. 117/2", list: "A" },
    { composer: "Johann Sebastian Bach", title: "Invention No. 6 in E, BWV 777", list: "A" },
    { composer: "Domenico Scarlatti", title: "Sonata in A, Kp. 208", list: "A" },
    { composer: "Franz Schubert", title: "Moment musical in F minor (No. 3 from Moments musicaux, D. 780)", list: "A" },
    { composer: "Joseph Haydn", title: "Adagio in F, Hob. XVII:9", list: "B" },
    { composer: "Isaac Albéniz", title: "Tango (No. 2 from España, Op. 165)", list: "B" },
    { composer: "Frédéric Chopin", title: "Waltz in A minor, KK IVb No. 11", list: "B" },
    { composer: "Robert Schumann", title: "Lonely Flowers (No. 3 from Waldszenen, Op. 82)", list: "B" },
  ],
  [
    { composer: "Felix Mendelssohn", title: "Christmas Piece in F (No. 6 from Six Christmas Pieces, Op. 72)", list: "A" },
    { composer: "George Frideric Handel", title: "Passacaille (from Suite No. 7 in G minor, HWV 432)", list: "A" },
    { composer: "Johann Sebastian Bach", title: "Gigue (from French Suite No. 3 in B minor, BWV 814)", list: "A" },
    { composer: "Ludwig van Beethoven", title: "Menuetto and Trio (3rd movt from Sonata in D, Op. 10 No. 3)", list: "A" },
    { composer: "Jean-Philippe Rameau", title: "Les sauvages (from Pièces de clavecin)", list: "A" },
    { composer: "Clara Schumann", title: "Scherzo (No. 4 from Quatre pièces fugitives, Op. 15)", list: "A" },
    { composer: "Claude Debussy", title: "The Little Shepherd (No. 5 from Children's Corner)", list: "B" },
    { composer: "John Field", title: "Nocturne in E minor", list: "B" },
    { composer: "Franz Liszt", title: "Consolation No. 5 in E (from Consolations, S. 172)", list: "B" },
    { composer: "Felix Mendelssohn", title: "Song without Words, Op. 19 No. 1", list: "B" },
    { composer: "Robert Schumann", title: "Child Falling Asleep (No. 12 from Kinderszenen, Op. 15)", list: "B" },
    { composer: "Edvard Grieg", title: "Butterfly (from Lyric Pieces, Op. 43)", list: "C" },
  ],
  [
    { composer: "Johann Sebastian Bach", title: "Allegro (1st movt from Italian Concerto, BWV 971)", list: "A" },
    { composer: "Ludwig van Beethoven", title: "Rondo (3rd movt from Sonata in C minor, 'Pathétique', Op. 13)", list: "A" },
    { composer: "Johann Sebastian Bach", title: "Prelude and Fugue in G, BWV 884 (Well-Tempered Clavier, Book 2)", list: "A" },
    { composer: "Wolfgang Amadeus Mozart", title: "Andante grazioso and Variations 1–6 (1st movt from Sonata in A, K. 331)", list: "A" },
    { composer: "Jean-Philippe Rameau", title: "Les cyclopes (from Pièces de clavecin)", list: "A" },
    { composer: "Frédéric Chopin", title: "Nocturne in E minor, Op. 72 No. 1", list: "B" },
    { composer: "Ludwig van Beethoven", title: "Adagio cantabile (2nd movt from Sonata in C minor, 'Pathétique', Op. 13)", list: "B" },
    { composer: "Franz Schubert", title: "Impromptu in A♭ (No. 2 from Four Impromptus, D. 935)", list: "B" },
    { composer: "Pyotr Ilyich Tchaikovsky", title: "January: By the Hearth (No. 1 from The Seasons)", list: "B" },
    { composer: "Claude Debussy", title: "Rêverie", list: "C" },
  ],
];

/* ---------------- Trinity ---------------- */

const TRINITY_SCALES: string[][] = [
  [
    "Prepare Set A or Set B, from memory, at mf legato:",
    "C major and A minor scales: one octave, one hand each",
    "Broken triads in C major and A minor: to the fifth",
    "Plus two short technical exercises from different groups",
  ],
  [
    "Set A: F major and E minor scales; chromatic contrary-motion scale from D; broken chords in G major and D minor",
    "Set B: G major and D minor scales; C major contrary-motion scale; broken chords in F major and E minor",
    "One octave. Plus two exercises from different groups",
  ],
  [
    "Set A: B♭ major and B minor scales, hands together; C major contrary motion; arpeggios in D major and G minor",
    "Set B: D major and G minor scales, hands together; chromatic scale from B♭; arpeggios in B♭ major and B minor",
    "Two octaves. Plus two exercises",
  ],
  [
    "Set A: E♭ major and C minor scales, hands together; chromatic scale from F♯; arpeggios in A major and F♯ minor",
    "Set B: A major and F♯ minor scales, hands together; E♭ major contrary motion; arpeggios in E♭ major and C minor",
    "Two octaves, with set dynamics. Plus two exercises",
  ],
  [
    "Set A: E major (legato) and F minor (staccato) scales; chromatic scales in similar and contrary motion; arpeggios in A♭ major and F minor",
    "Set B: A♭ major (staccato) and C♯ minor (legato) scales; E major contrary motion; chromatic scale from B; arpeggios in E major and C♯ minor",
    "Plus two exercises",
  ],
  [
    "Set A: D♭ major and G♯ minor scales; G harmonic minor in contrary motion; chromatic contrary motion (C and E); arpeggios in B major and B♭ minor; diminished seventh on B",
    "Set B: B major and B♭ minor scales; chromatic scale from D♭; chromatic contrary motion; arpeggios in D♭ major and G♯ minor; diminished seventh on B",
    "Two octaves, legato and staccato with set dynamics. Plus two exercises",
  ],
  [
    "Four-octave scales and arpeggios; Set A centres on B♭ and D (major, harmonic and melodic minor)",
    "A scale in thirds (C major, right hand), chromatic scales in similar and contrary motion",
    "Dominant and diminished sevenths. Plus two exercises",
  ],
  [
    "Four-octave scales and arpeggios with crescendo and diminuendo; Set B includes A♭ major and E melodic minor",
    "Chromatic scales starting on different notes in each hand; dominant and diminished sevenths",
    "Plus two exercises",
  ],
  [
    "Set A: F♯ major scale; chromatic scale; arpeggios in B major and E♭ minor; dominant seventh in B",
    "Set B: E♭ major and F♯ harmonic minor scales; arpeggios in F♯ major and B minor; dominant seventh in F♯",
    "Four octaves, with crescendo and diminuendo. Plus two exercises",
  ],
];

const TRINITY_PIECES: Piece[][] = [
  [
    { composer: "Alexander Reinagle", title: "Allegretto (No. 9 from 24 Short and Easy Pieces, Op. 1)" },
    { composer: "Alexander Reinagle", title: "Allegro (No. 4 from 24 Short and Easy Pieces, Op. 1)" },
    { composer: "George Frideric Handel", title: "Gavotte in C" },
    { composer: "Daniel Gottlob Türk", title: "Spring Song" },
    { composer: "Béla Bartók", title: "Imitation and Inversion (No. 23 from Mikrokosmos, Vol. 1)" },
  ],
  [
    { composer: "Ludwig van Beethoven", title: "Russian Folk Song (No. 3 from 10 National Airs with Variations, Op. 107)" },
    { composer: "Mel Bonis", title: "The Little Beggar (from Album pour les tout-petits, Op. 103)" },
    { composer: "Jeremiah Clarke", title: "King William's March" },
    { composer: "Anton Diabelli", title: "Bagatelle" },
    { composer: "Elisabetta de Gambarini", title: "Minuet (2nd movt from Sonata in D minor, Op. 1 No. 6)" },
    { composer: "George Frideric Handel", title: "Passepied in C, HWV 559" },
    { composer: "Daniel Gottlob Türk", title: "Arioso (from Klavierschule)" },
    { composer: "Daniel Gottlob Türk", title: "Minuet in G" },
  ],
  [
    { composer: "Mel Bonis", title: "The Sewing Machine (from Album pour les tout-petits, Op. 103)" },
    { composer: "Cornelius Gurlitt", title: "Melodic Study (No. 4 from 16 Melodische Etüden, Op. 198)" },
    { composer: "Joseph Haydn", title: "German Dance, Hob. IX:12 No. 1" },
    { composer: "Christian Petzold", title: "Minuet in G minor" },
    { composer: "Henry Purcell", title: "Hornpipe in E minor, Z. 685" },
    { composer: "Georg Philipp Telemann", title: "Fantasia in G minor" },
    { composer: "Carl Maria von Weber", title: "Allemande, Op. 4 No. 2" },
  ],
  [
    { composer: "Thomas Attwood", title: "Rondo (3rd movt from Sonatina in G)" },
    { composer: "Muzio Clementi", title: "Waltz in E♭" },
    { composer: "François Couperin", title: "Les coucous bénévoles" },
    { composer: "Cornelius Gurlitt", title: "Wild Mignonette (No. 1 from Little Flowers, Op. 205)" },
    { composer: "Joseph Haydn", title: "Andante (3rd movt from Sonata in G, Hob. XVI:8)" },
    { composer: "Béla Bartók", title: "The Highway Robber (from For Children)" },
  ],
  [
    { composer: "Carl Philipp Emanuel Bach", title: "Affettuoso" },
    { composer: "Wilhelm Friedemann Bach", title: "Allegro in A" },
    { composer: "Friedrich Burgmüller", title: "Barcarolle (No. 22 from 25 Easy and Progressive Studies, Op. 100)" },
    { composer: "Muzio Clementi", title: "Allegretto (1st movt from Sonatina in G, Op. 36 No. 2)" },
    { composer: "Muzio Clementi", title: "Andante con espressione (2nd movt from Sonatina in F, Op. 36 No. 4)" },
    { composer: "Friedrich Kuhlau", title: "Allegretto (from Sonatina in G, Op. 55 No. 2)" },
    { composer: "Wolfgang Amadeus Mozart", title: "Allegretto (from The London Sketchbook, K. 15hh)" },
    { composer: "Robert Schumann", title: "Sicilienne (No. 11 from Album for the Young, Op. 68)" },
  ],
  [
    { composer: "Johann Sebastian Bach", title: "Two-Part Invention No. 4 in D minor, BWV 775" },
    { composer: "Johann Sebastian Bach", title: "Prelude in C, BWV 846 (Well-Tempered Clavier, Book 1)" },
    { composer: "Johann Sebastian Bach", title: "Gavotte (from French Suite No. 5 in G, BWV 816)" },
    { composer: "Friedrich Burgmüller", title: "Berceuse (No. 7 from 18 Characteristic Studies, Op. 109)" },
    { composer: "Friedrich Kuhlau", title: "Allegro con spirito (1st movt from Sonatina in C, Op. 55 No. 3)" },
    { composer: "Franz Schubert", title: "Valse sentimentale, Op. 50 No. 13" },
    { composer: "Robert Schumann", title: "The Horseman (No. 23 from Album for the Young, Op. 68)" },
    { composer: "Pyotr Ilyich Tchaikovsky", title: "Sweet Reverie (No. 21 from Album for the Young, Op. 39)" },
  ],
  [
    { composer: "Johann Sebastian Bach", title: "Invention No. 6 in E, BWV 777" },
    { composer: "Johann Sebastian Bach", title: "Prelude in D minor, BWV 935" },
    { composer: "François Couperin", title: "Les petits moulins à vent (The Little Windmills)" },
    { composer: "Joseph Haydn", title: "Finale (3rd movt from Sonata in C, Hob. XVI:35)" },
    { composer: "Franz Schubert", title: "Allegretto in C minor, D. 915" },
    { composer: "Friedrich Burgmüller", title: "The Gondolier's Song (No. 14 from 18 Characteristic Studies, Op. 109)" },
    { composer: "Edvard Grieg", title: "Solitary Traveller (No. 2 from Lyric Pieces, Op. 43)" },
  ],
  [
    { composer: "Johann Sebastian Bach", title: "Aria (from the Goldberg Variations, BWV 988)" },
    { composer: "Johann Sebastian Bach", title: "Invention No. 12 in A, BWV 783" },
    { composer: "George Frideric Handel", title: "Capriccio in G minor, HWV 483" },
    { composer: "Joseph Haydn", title: "Finale (3rd movt from Sonata in D, Hob. XVI:24)" },
    { composer: "Wolfgang Amadeus Mozart", title: "Minuet in D, K. 355" },
    { composer: "Frédéric Chopin", title: "Mazurka in F minor, Op. 63 No. 2" },
    { composer: "Felix Mendelssohn", title: "No. 2 from Kinderstücke, Op. 72" },
    { composer: "Franz Schubert", title: "Andante (2nd movt from Sonata in A, D. 664)" },
  ],
  [
    { composer: "Johann Sebastian Bach", title: "Prelude and Fugue in E, BWV 854 (Well-Tempered Clavier, Book 1)" },
    { composer: "Ludwig van Beethoven", title: "Allegro (1st movt from Sonata in G, Op. 14 No. 2)" },
    { composer: "Joseph Haydn", title: "Moderato (1st movt from Sonata in G minor, Hob. XVI:44)" },
    { composer: "Wolfgang Amadeus Mozart", title: "Allegro (1st movt from Sonata in B♭, K. 570)" },
    { composer: "Domenico Scarlatti", title: "Sonata in F minor, K. 19" },
    { composer: "Johannes Brahms", title: "Intermezzo in B minor, Op. 119 No. 1" },
    { composer: "Frédéric Chopin", title: "Waltz in D♭, Op. 64 No. 1" },
    { composer: "Claude Debussy", title: "Clair de lune (from Suite bergamasque)" },
    { composer: "Scott Joplin", title: "The Cascades" },
    { composer: "Pyotr Ilyich Tchaikovsky", title: "October (from The Seasons)" },
  ],
];

const TRINITY_HOURS = [40, 60, 90, 120, 150, 180, 220, 270, 320];
const ABRSM_MINUTES = [12, 12, 12, 12, 15, 15, 20, 25, 30];

export const BOARDS: Record<BoardId, Board> = {
  abrsm: {
    id: "abrsm",
    name: "ABRSM",
    fullName: "Associated Board of the Royal Schools of Music",
    blurb: "The UK board taken around the world. Three pieces, scales, sight-reading and aural tests.",
    syllabus: "Piano Practical Grades 2027 & 2028",
    validity:
      "This syllabus is valid from 1 January 2027 to 31 December 2028. Pieces from the 2025 & 2026 syllabus may still be played until 31 December 2027. Scales, sight-reading and aural tests are unchanged.",
    marks: [
      { part: "Piece 1 (List A)", max: 30 },
      { part: "Piece 2 (List B)", max: 30 },
      { part: "Piece 3 (List C)", max: 30 },
      { part: "Scales and arpeggios", max: 21 },
      { part: "Sight-reading", max: 21 },
      { part: "Aural tests", max: 18 },
    ],
    total: 150,
    results: [
      { label: "Distinction", range: "130–150" },
      { label: "Merit", range: "120–129" },
      { label: "Pass", range: "100–119" },
    ],
    facts: [
      "One piece from each list: A pieces are generally faster and need agility; B pieces are lyrical and expressive; C pieces cover a wide variety of styles and traditions.",
      "Scales and arpeggios are played from memory, without pedal, in even notes.",
      "To take Grades 6–8 you first need Grade 5 Music Theory (or Practical Musicianship, or a solo Jazz grade).",
      "You don't have to pass every section to pass overall.",
    ],
    sightReadingNote:
      "You get half a minute to look through the test and try out any of it before you play. Parameters are cumulative: each grade keeps everything from the grades before.",
    officialUrl: "https://www.abrsm.org/en-gb/instruments/piano",
    repertoireUrl:
      "https://www.abrsm.org/sites/default/files/2026-06/Piano%20Practical%20Grades%20Qualification%20Specification%202027%20&%202028.pdf",
    grades: IDS.map((id, i) => ({
      id,
      name: GRADE_NAMES[i],
      level: i,
      about: ABOUT[i],
      sightReading: ABRSM_SR[i],
      scales: ABRSM_SCALES[i],
      aural: ABRSM_AURAL[i],
      pieces: ABRSM_PIECES[i],
      minutes: ABRSM_MINUTES[i],
    })),
  },
  trinity: {
    id: "trinity",
    name: "Trinity",
    fullName: "Trinity College London",
    blurb: "A flexible syllabus with a choice of supporting tests and a large repertoire list at every grade.",
    syllabus: "Piano syllabus, graded exams from 2023",
    validity:
      "Repertoire from Trinity's 2021 and 2023 piano books is used for this syllabus, and most pieces and exercises stay valid indefinitely. Exams can be taken face to face or by video.",
    marks: [
      { part: "Piece 1", max: 22 },
      { part: "Piece 2", max: 22 },
      { part: "Piece 3", max: 22 },
      { part: "Technical work (scales, arpeggios, exercises)", max: 14 },
      { part: "Supporting tests (two, 10 marks each)", max: 20 },
    ],
    total: 100,
    results: [
      { label: "Distinction", range: "87–100" },
      { label: "Merit", range: "75–86" },
      { label: "Pass", range: "60–74" },
    ],
    facts: [
      "Initial to Grade 5: choose any two supporting tests from sight reading, aural, improvisation and musical knowledge.",
      "Grades 6–8: sight reading is compulsory, plus aural or improvisation.",
      "Technical work: prepare Set A or Set B of scales and arpeggios, plus two exercises from different groups.",
      "Grades 6–8 earn UCAS points in the UK (Grade 8 Distinction: 30 points).",
    ],
    sightReadingNote:
      "Trinity's sight reading is set about two grades below the exam you're taking. You get 30 seconds to study it and may try any of it aloud.",
    officialUrl: "https://www.trinitycollege.com/qualifications/music/grade-exams/piano",
    repertoireUrl: "https://www.trinitycollege.com/qualifications/music/grade-exams/piano",
    grades: IDS.map((id, i) => ({
      id,
      name: GRADE_NAMES[i],
      level: i,
      about: ABOUT[i],
      sightReading: [
        `Set at about ${i <= 2 ? "Initial" : `Grade ${i - 2}`} level`,
        "30 seconds to study the test, trying any of it aloud",
        i >= 6 ? "Compulsory at this grade" : "One of four supporting tests you can choose",
      ],
      scales: TRINITY_SCALES[i],
      pieces: TRINITY_PIECES[i],
      hours: TRINITY_HOURS[i],
    })),
  },
};

export const boardList = () => [BOARDS.abrsm, BOARDS.trinity];
export const findGrade = (b: BoardId, g: string) => BOARDS[b]?.grades.find((x) => x.id === g);

/** Sight-reading level for practice. Trinity tests sit about two grades lower. */
export const practiceLevel = (b: BoardId, level: number) => (b === "trinity" ? Math.max(0, level - 2) : level);

export const imslp = (composer: string, title: string) =>
  `https://imslp.org/index.php?title=Special:Search&search=${encodeURIComponent(`${composer.split(" ").pop()} ${title.replace(/\(.*?\)/g, "")}`)}`;
