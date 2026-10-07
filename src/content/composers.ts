// Composer profiles. Dates and facts are kept to the well documented; where sources differ we say so.

export type Era = "Baroque" | "Classical" | "Romantic" | "Modern";

export type Composer = {
  slug: string;
  name: string;
  born: number;
  died: number;
  bornCirca?: boolean;
  from: string; // country / region, as it is known today
  era: Era;
  summary: string;
  piano: string[]; // notable piano works
  start: { title: string; level: string }[]; // good first pieces, with a rough grade
  fact: string;
};

export const ERAS: { era: Era; span: string; about: string }[] = [
  {
    era: "Baroque",
    span: "c. 1600–1750",
    about:
      "Keyboard music for harpsichord, clavichord and organ: dances, preludes and fugues, built from independent lines woven together. Played on the piano today with clear articulation and little pedal.",
  },
  {
    era: "Classical",
    span: "c. 1750–1820",
    about:
      "Clarity, balance and elegant melody over a simple accompaniment. The sonata becomes the central form, and the fortepiano, with its new loud and soft, replaces the harpsichord.",
  },
  {
    era: "Romantic",
    span: "c. 1820–1900",
    about:
      "Personal expression, rich harmony and singing melody. Short character pieces, virtuoso showpieces, nocturnes and dances; the pedal and rubato become part of the sound.",
  },
  {
    era: "Modern",
    span: "c. 1900 onwards",
    about:
      "Many paths at once: Impressionist colour, folk rhythms, ragtime and jazz, new scales and harmonies, and fresh ideas about what a piano can do.",
  },
];

export const COMPOSERS: Composer[] = [
  {
    slug: "purcell", name: "Henry Purcell", born: 1659, died: 1695, from: "England", era: "Baroque",
    summary: "The great English composer of his age, organist at Westminster Abbey, who wrote for the stage, the church and the court before dying in his thirties.",
    piano: ["Harpsichord suites", "Short airs, hornpipes and grounds"],
    start: [{ title: "Air in D minor", level: "Grade 2" }, { title: "Hornpipe in E minor", level: "Grade 2" }],
    fact: "His opera Dido and Aeneas contains 'Dido's Lament', one of the most famous laments ever written, built over a repeating bass line.",
  },
  {
    slug: "couperin", name: "François Couperin", born: 1668, died: 1733, from: "France", era: "Baroque",
    summary: "A French court musician known as 'le Grand', who wrote four books of harpsichord pieces with picturesque titles.",
    piano: ["Pièces de clavecin (four books)", "Les barricades mystérieuses", "Le tic-toc-choc"],
    start: [{ title: "Les coucous bénévoles", level: "Grade 3" }, { title: "Les petits moulins à vent", level: "Grade 6" }],
    fact: "He wrote a book on how to play the harpsichord, L'art de toucher le clavecin (1716), with advice on fingering and posture that teachers still quote.",
  },
  {
    slug: "rameau", name: "Jean-Philippe Rameau", born: 1683, died: 1764, from: "France", era: "Baroque",
    summary: "Composer and music theorist whose Treatise on Harmony (1722) shaped how harmony was taught for centuries; his operas came later in life.",
    piano: ["Pièces de clavecin", "Les cyclopes", "Les sauvages", "La poule"],
    start: [{ title: "Les sauvages", level: "Grade 7" }, { title: "Les cyclopes", level: "Grade 8" }],
    fact: "La poule ('The Hen') imitates clucking with fast repeated notes.",
  },
  {
    slug: "bach", name: "Johann Sebastian Bach", born: 1685, died: 1750, from: "Germany", era: "Baroque",
    summary: "Organist, choir director and the summit of Baroque counterpoint. His keyboard works are still the foundation of piano study.",
    piano: ["The Well-Tempered Clavier (two books of 24 preludes and fugues)", "Two- and Three-Part Inventions", "French and English Suites", "Goldberg Variations", "Italian Concerto"],
    start: [{ title: "Pieces from the Notebook for Anna Magdalena Bach", level: "Grades 1–3" }, { title: "Two-Part Invention No. 8 in F", level: "Grade 5" }],
    fact: "In 1705, as a young organist, he walked about 400 km (250 miles) to Lübeck to hear the famous organist Buxtehude, and stayed far longer than his employers had allowed.",
  },
  {
    slug: "handel", name: "George Frideric Handel", born: 1685, died: 1759, from: "Germany, later England", era: "Baroque",
    summary: "Born in Halle the same year as Bach, he made his career in London writing operas and oratorios, and became a British subject.",
    piano: ["Suites de pièces pour le clavecin", "The 'Harmonious Blacksmith' variations", "Chaconnes and fughettas"],
    start: [{ title: "Gavotte in C", level: "Initial–Grade 1" }, { title: "Passepied in C", level: "Grade 1" }],
    fact: "He composed Messiah in about three and a half weeks in 1741.",
  },
  {
    slug: "scarlatti", name: "Domenico Scarlatti", born: 1685, died: 1757, from: "Italy, later Spain", era: "Baroque",
    summary: "An Italian who spent most of his life at the Portuguese and Spanish courts, writing short, brilliant keyboard sonatas full of hand-crossings and Spanish colour.",
    piano: ["555 keyboard sonatas"],
    start: [{ title: "Minuet from Sonata in A, K. 83", level: "Grade 4" }, { title: "Sonata in A, K. 208", level: "Grade 6" }],
    fact: "Most of his sonatas were written for his pupil Maria Barbara, who became Queen of Spain. They're numbered K. (or Kp.) after the harpsichordist Ralph Kirkpatrick, who catalogued them.",
  },
  {
    slug: "cpe-bach", name: "Carl Philipp Emanuel Bach", born: 1714, died: 1788, from: "Germany", era: "Classical",
    summary: "J. S. Bach's second surviving son and in his day the more famous Bach: a keyboard player at the court of Frederick the Great and a pioneer of the expressive 'sensitive style'.",
    piano: ["Keyboard sonatas", "Solfeggietto in C minor", "Essay on the True Art of Playing Keyboard Instruments"],
    start: [{ title: "Solfeggietto in C minor", level: "Grade 6" }],
    fact: "Haydn said he owed a great deal to his sonatas, and Beethoven had his pupil Czerny work from the Essay on the True Art of Playing Keyboard Instruments.",
  },
  {
    slug: "haydn", name: "Joseph Haydn", born: 1732, died: 1809, from: "Austria", era: "Classical",
    summary: "For nearly thirty years music director to the Esterházy princes, Haydn shaped the symphony, the string quartet and the piano sonata, with endless wit.",
    piano: ["Over 60 keyboard sonatas", "Variations in F minor", "Short dances and pieces"],
    start: [{ title: "German Dance", level: "Grade 2" }, { title: "Andante from Sonata in G, Hob. XVI:8", level: "Grade 3" }],
    fact: "His 'Surprise' Symphony (No. 94) is named for a sudden loud chord in its quiet slow movement. An arrangement of that movement is an ABRSM Grade 1 piece.",
  },
  {
    slug: "clementi", name: "Muzio Clementi", born: 1752, died: 1832, from: "Italy, later England", era: "Classical",
    summary: "Pianist, composer, publisher and piano maker in London, sometimes called the father of the piano. His sonatinas are still among the first 'real' pieces students play.",
    piano: ["Six Sonatinas, Op. 36", "Gradus ad Parnassum (studies)", "Piano sonatas"],
    start: [{ title: "Sonatina in C, Op. 36 No. 1", level: "Grades 2–3" }, { title: "Sonatina in G, Op. 36 No. 2", level: "Grade 4" }],
    fact: "In 1781 he and Mozart played in a friendly keyboard contest in Vienna before Emperor Joseph II. Mozart was not impressed by him; Beethoven later admired his sonatas.",
  },
  {
    slug: "mozart", name: "Wolfgang Amadeus Mozart", born: 1756, died: 1791, from: "Austria", era: "Classical",
    summary: "A child prodigy from Salzburg who became one of the greatest composers of all, writing operas, symphonies, concertos and sonatas before dying at 35.",
    piano: ["18 piano sonatas, including K. 331 ('Alla turca') and K. 545", "27 piano concertos", "Variations on 'Ah vous dirai-je, maman'", "Early minuets"],
    start: [{ title: "Minuet in F, K. 5", level: "Grade 3" }, { title: "Allegro from Sonata in C, K. 545", level: "Grade 6" }],
    fact: "He wrote his Minuet in F, K. 5 at the age of six. It's on the ABRSM 2027–28 Grade 3 list.",
  },
  {
    slug: "beethoven", name: "Ludwig van Beethoven", born: 1770, died: 1827, from: "Germany, later Austria", era: "Classical",
    summary: "Born in Bonn, he moved to Vienna and carried music from the Classical into the Romantic age. He kept composing after he had become profoundly deaf.",
    piano: ["32 piano sonatas, including the 'Pathétique' and 'Moonlight'", "Five piano concertos", "Bagatelles", "Für Elise"],
    start: [{ title: "German Dance in C", level: "Grade 1" }, { title: "Für Elise", level: "around Grade 5" }],
    fact: "Für Elise was not published in his lifetime. It was found and printed in 1867, forty years after he died, and nobody is certain who 'Elise' was.",
  },
  {
    slug: "kuhlau", name: "Friedrich Kuhlau", born: 1786, died: 1832, from: "Germany, later Denmark", era: "Classical",
    summary: "A German-born composer who settled in Copenhagen. His sonatinas sit perfectly between Clementi's and the full sonatas of Mozart and Beethoven.",
    piano: ["Sonatinas, Opp. 20, 55, 59, 60 and 88"],
    start: [{ title: "Sonatina in C, Op. 55 No. 3", level: "Grade 5" }],
    fact: "When he visited Beethoven, the two wrote each other punning canons. Beethoven's was 'Kühl, nicht lau': 'cool, not lukewarm', a play on Kuhlau's name.",
  },
  {
    slug: "czerny", name: "Carl Czerny", born: 1791, died: 1857, from: "Austria", era: "Romantic",
    summary: "Pianist and teacher in Vienna whose books of studies have trained pianists' fingers for two centuries.",
    piano: ["The School of Velocity, Op. 299", "The Art of Finger Dexterity, Op. 740", "Hundreds of studies"],
    start: [{ title: "Studies from Op. 599", level: "Grades 1–3" }],
    fact: "He was a pupil of Beethoven and the teacher of Liszt, so he links two of the greatest pianists in history.",
  },
  {
    slug: "schubert", name: "Franz Schubert", born: 1797, died: 1828, from: "Austria", era: "Romantic",
    summary: "A Viennese composer of extraordinary melody who wrote more than 600 songs, chamber music, symphonies and piano music, and died at just 31.",
    piano: ["Impromptus", "Moments musicaux", "Piano sonatas", "Waltzes and dances"],
    start: [{ title: "German Dance in A, D. 972", level: "Grade 3" }, { title: "Moment musical in F minor", level: "Grade 6" }],
    fact: "Friends gathered for evenings of his music, which came to be called 'Schubertiades'.",
  },
  {
    slug: "burgmuller", name: "Friedrich Burgmüller", born: 1806, died: 1874, from: "Germany, later France", era: "Romantic",
    summary: "A German composer who settled in Paris and wrote some of the best-loved teaching pieces ever: short, tuneful and each with its own character.",
    piano: ["25 Easy and Progressive Studies, Op. 100", "18 Characteristic Studies, Op. 109"],
    start: [{ title: "Arabesque (Op. 100 No. 2)", level: "around Grade 2" }, { title: "Barcarolle (Op. 100 No. 22)", level: "Grade 4" }],
    fact: "His Op. 100 studies are especially popular in Japan, where generations of students have learned them.",
  },
  {
    slug: "fanny-mendelssohn", name: "Fanny Mendelssohn Hensel", born: 1805, died: 1847, from: "Germany", era: "Romantic",
    summary: "A brilliant pianist and composer, Felix Mendelssohn's older sister, who wrote over 450 works, many of them only published long after her death.",
    piano: ["Das Jahr (The Year), twelve pieces for the months", "Songs without words", "Piano sonatas"],
    start: [{ title: "Pieces from Das Jahr", level: "Grades 6–8" }],
    fact: "A few of her songs were first published under Felix's name.",
  },
  {
    slug: "mendelssohn", name: "Felix Mendelssohn", born: 1809, died: 1847, from: "Germany", era: "Romantic",
    summary: "A prodigy who wrote the Octet at 16 and the Midsummer Night's Dream overture at 17, and later led the Leipzig Gewandhaus Orchestra.",
    piano: ["Songs without Words (eight books)", "Rondo capriccioso", "Children's pieces, Op. 72"],
    start: [{ title: "Christmas Piece, Op. 72", level: "Grade 7" }, { title: "Song without Words, Op. 19 No. 1", level: "Grade 7" }],
    fact: "In 1829, aged 20, he conducted Bach's St Matthew Passion in Berlin, its first performance since Bach's time, and sparked a Bach revival.",
  },
  {
    slug: "chopin", name: "Frédéric Chopin", born: 1810, died: 1849, from: "Poland, later France", era: "Romantic",
    summary: "The poet of the piano. Born near Warsaw, he settled in Paris at 21. Almost everything he wrote involves the piano.",
    piano: ["Nocturnes", "Waltzes", "Mazurkas and polonaises", "Études", "Preludes, Op. 28", "Ballades"],
    start: [{ title: "Waltz in A minor, KK IVb No. 11", level: "Grade 6" }, { title: "Prelude in E minor, Op. 28 No. 4", level: "around Grade 5" }],
    fact: "At his wish, his heart was taken back to Warsaw; it rests in a pillar of the Holy Cross Church.",
  },
  {
    slug: "schumann", name: "Robert Schumann", born: 1810, died: 1856, from: "Germany", era: "Romantic",
    summary: "Composer and music critic whose piano cycles are full of characters and hidden stories. Married to the pianist Clara Wieck.",
    piano: ["Album for the Young, Op. 68", "Kinderszenen (Scenes from Childhood), Op. 15", "Carnaval", "Waldszenen"],
    start: [{ title: "The Wild Horseman, Op. 68 No. 8", level: "Grade 3" }, { title: "Of Foreign Lands and Peoples", level: "Grade 5" }],
    fact: "He wrote the Album for the Young in 1848 for his daughters, to give children real music to play.",
  },
  {
    slug: "liszt", name: "Franz Liszt", born: 1811, died: 1886, from: "Hungary", era: "Romantic",
    summary: "The great virtuoso of the 19th century, a composer of dazzling showpieces and, later in life, generous teacher and quietly experimental composer.",
    piano: ["Hungarian Rhapsodies", "Liebesträume", "Consolations", "Années de pèlerinage", "Transcendental Études"],
    start: [{ title: "Consolation No. 5", level: "Grade 7" }],
    fact: "He is credited with the modern solo piano recital: a whole concert by one pianist, often from memory.",
  },
  {
    slug: "clara-schumann", name: "Clara Schumann", born: 1819, died: 1896, from: "Germany", era: "Romantic",
    summary: "One of the leading concert pianists of the century, a composer, and a teacher, who performed for more than sixty years.",
    piano: ["Quatre pièces fugitives, Op. 15", "Piano Concerto in A minor", "Romances", "Sonata in G minor"],
    start: [{ title: "Scherzo from Quatre pièces fugitives", level: "Grade 7" }],
    fact: "She helped make it normal to play concerts from memory, which was unusual when she began.",
  },
  {
    slug: "gurlitt", name: "Cornelius Gurlitt", born: 1820, died: 1901, from: "Germany", era: "Romantic",
    summary: "An organist and teacher in Altona, near Hamburg, whose short pieces for young pianists are melodic and full of character.",
    piano: ["Albumleaves for the Young, Op. 101", "First Lessons, Op. 117", "Sonatinas"],
    start: [{ title: "The Chase, Op. 117 No. 15", level: "Grade 1" }, { title: "Song, Op. 172 No. 1", level: "Grade 3" }],
    fact: "His pieces appear across the grade lists of several exam boards, from the very first grades upwards.",
  },
  {
    slug: "brahms", name: "Johannes Brahms", born: 1833, died: 1897, from: "Germany, later Austria", era: "Romantic",
    summary: "Championed as a young man by Robert and Clara Schumann, he became a master of rich, warm harmony and classical form.",
    piano: ["Intermezzi, Opp. 117–119", "Waltzes, Op. 39", "Hungarian Dances (piano duet)", "Two piano concertos"],
    start: [{ title: "Waltz in A♭, Op. 39 No. 15", level: "around Grade 6" }, { title: "Intermezzo in B minor, Op. 119 No. 1", level: "Grade 8" }],
    fact: "His Lullaby ('Wiegenlied') is one of the best-known melodies in the world.",
  },
  {
    slug: "tchaikovsky", name: "Pyotr Ilyich Tchaikovsky", born: 1840, died: 1893, from: "Russia", era: "Romantic",
    summary: "Composer of The Nutcracker, Swan Lake and six symphonies, whose piano music is warm, songful and often written for amateurs and children.",
    piano: ["Album for the Young, Op. 39", "The Seasons", "Piano Concerto No. 1"],
    start: [{ title: "Chanson italienne, Op. 39", level: "Grade 3" }, { title: "Sweet Reverie, Op. 39", level: "Grade 5" }],
    fact: "The Seasons appeared one piece a month through 1876 in a St Petersburg music magazine, one for each month of the year.",
  },
  {
    slug: "grieg", name: "Edvard Grieg", born: 1843, died: 1907, from: "Norway", era: "Romantic",
    summary: "Norway's best-known composer, who brought the sound of Norwegian folk music into concert halls.",
    piano: ["Lyric Pieces (66 pieces in ten books)", "Piano Concerto in A minor", "Holberg Suite"],
    start: [{ title: "Elfin Dance, Op. 12 No. 4", level: "Grade 4" }, { title: "Butterfly, Op. 43 No. 1", level: "Grade 7" }],
    fact: "He composed in a small hut by the water at Troldhaugen, his home near Bergen, which still stands.",
  },
  {
    slug: "chaminade", name: "Cécile Chaminade", born: 1857, died: 1944, from: "France", era: "Romantic",
    summary: "A pianist and composer whose elegant salon pieces were hugely popular in her lifetime, especially in Britain and America.",
    piano: ["Album des enfants, Opp. 123 and 126", "Pierrette", "Scarf Dance"],
    start: [{ title: "Gavotte, Op. 123 No. 5", level: "Grade 5" }],
    fact: "In 1913 she became the first woman composer awarded the Légion d'honneur.",
  },
  {
    slug: "debussy", name: "Claude Debussy", born: 1862, died: 1918, from: "France", era: "Modern",
    summary: "He found new colours in the piano: washes of sound, unusual scales and harmonies that seem to float. Often called an Impressionist, though he disliked the label.",
    piano: ["Suite bergamasque (with Clair de lune)", "Children's Corner", "Préludes (two books)", "Arabesques", "Rêverie"],
    start: [{ title: "The Little Shepherd (Children's Corner)", level: "Grade 7" }, { title: "Rêverie", level: "Grade 8" }],
    fact: "Children's Corner was written for his young daughter, nicknamed Chouchou. One movement, 'Doctor Gradus ad Parnassum', pokes fun at dull piano studies.",
  },
  {
    slug: "satie", name: "Erik Satie", born: 1866, died: 1925, from: "France", era: "Modern",
    summary: "An eccentric Parisian whose simple, calm piano pieces influenced composers from Debussy to the minimalists.",
    piano: ["Gymnopédies", "Gnossiennes"],
    start: [{ title: "Gymnopédie No. 1", level: "around Grade 4" }],
    fact: "His short piece Vexations carries a note suggesting it be played 840 times in a row. The first complete performance, organised by John Cage in 1963, took a team of pianists over 18 hours.",
  },
  {
    slug: "granados", name: "Enrique Granados", born: 1867, died: 1916, from: "Spain", era: "Modern",
    summary: "A Catalan pianist and composer whose music captures the dances and spirit of Spain.",
    piano: ["Goyescas", "Danzas españolas", "Cuentos de la juventud", "Valses poéticos"],
    start: [{ title: "Dedicatoria, Op. 1 No. 1", level: "Grade 4" }],
    fact: "He died in 1916 when the ship Sussex, on which he was returning from New York, was torpedoed in the English Channel.",
  },
  {
    slug: "joplin", name: "Scott Joplin", born: 1868, died: 1917, bornCirca: true, from: "United States", era: "Modern",
    summary: "The 'King of Ragtime', whose piano rags combined African American rhythms with a classical sense of form.",
    piano: ["Maple Leaf Rag", "The Entertainer", "Solace", "The Cascades"],
    start: [{ title: "The Entertainer (simplified editions exist)", level: "around Grade 5" }, { title: "The Cascades", level: "Grade 8" }],
    fact: "His music had a huge second life when The Entertainer was used in the 1973 film The Sting.",
  },
  {
    slug: "rachmaninoff", name: "Sergei Rachmaninoff", born: 1873, died: 1943, from: "Russia, later United States", era: "Romantic",
    summary: "One of the greatest pianists who ever lived, and a composer of lush, late-Romantic music. He left Russia after the 1917 revolution.",
    piano: ["Preludes, including the C♯ minor", "Moments musicaux, Op. 16", "Piano Concertos Nos. 2 and 3", "Rhapsody on a Theme of Paganini"],
    start: [{ title: "Moment musical in D♭, Op. 16 No. 5", level: "Grade 8" }],
    fact: "He had famously large hands; accounts say he could stretch a 13th.",
  },
  {
    slug: "ravel", name: "Maurice Ravel", born: 1875, died: 1937, from: "France", era: "Modern",
    summary: "A precise craftsman of glittering sound, whose piano music is as colourful as an orchestra.",
    piano: ["Le tombeau de Couperin", "Pavane pour une infante défunte", "Ma mère l'Oye (duet)", "Gaspard de la nuit", "Jeux d'eau"],
    start: [{ title: "Pavane de la belle au bois dormant (duet)", level: "Grade 2" }, { title: "Prélude (1913)", level: "Grade 7" }],
    fact: "Each movement of Le tombeau de Couperin is dedicated to a friend killed in the First World War.",
  },
  {
    slug: "bartok", name: "Béla Bartók", born: 1881, died: 1945, from: "Hungary", era: "Modern",
    summary: "Composer, pianist and folk-music researcher who blended the rhythms of Eastern European folk songs with bold modern harmony.",
    piano: ["Mikrokosmos (153 progressive pieces in six volumes)", "For Children", "Romanian Folk Dances", "Allegro barbaro"],
    start: [{ title: "Pieces from Mikrokosmos, Vol. 1", level: "Initial–Grade 1" }, { title: "Sorrow (For Children)", level: "Grade 2" }],
    fact: "He travelled through villages recording folk singers on a phonograph, collecting thousands of melodies.",
  },
  {
    slug: "price", name: "Florence Price", born: 1887, died: 1953, from: "United States", era: "Modern",
    summary: "A composer from Little Rock, Arkansas, who blended spirituals and African American dance rhythms with the Romantic tradition.",
    piano: ["Teaching pieces", "Dances in the Canebrakes", "Fantasie nègre"],
    start: [{ title: "Daisies: Waltz (In Summer Fields)", level: "Grade 3" }, { title: "The Goblin and the Mosquito", level: "Grade 4" }],
    fact: "In 1933 her Symphony in E minor was played by the Chicago Symphony Orchestra: the first symphony by an African American woman performed by a major American orchestra.",
  },
];

export const composerBySlug = (s: string) => COMPOSERS.find((c) => c.slug === s);
export const lifespan = (c: Composer) => `${c.bornCirca ? "c. " : ""}${c.born}–${c.died}`;
