export const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];
export const shuffle = <T,>(xs: readonly T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
/** The answer plus distinct distractors, shuffled. */
export const optionsWith = <T,>(answer: T, pool: readonly T[], n = 4): T[] =>
  shuffle([answer, ...shuffle(pool.filter((x) => x !== answer)).slice(0, n - 1)]);
