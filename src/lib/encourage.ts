// Warm, honest feedback. Chosen from the score and round count, not at random, so it is stable between renders.

const pick = (list: string[], n: number) => list[n % list.length];

export function encourage(right: number, total: number, rounds: number): string {
  const r = total ? right / total : 0;
  if (r === 1) return pick(["Every note. Take a breath and enjoy that.", "Clean all the way through. Well played.", "Not one miss. That is real reading."], rounds);
  if (r >= 0.85) return pick(["Very nearly clean. This is how reading gets fast.", "That's solid. The odd slip is normal, even for professionals.", "Lovely. Keep your eyes a little ahead and it will get easier."], rounds);
  if (r >= 0.6) return pick(["Good going. The notes you missed are the ones worth another look.", "More than half of it was right the first time. That is progress you can hear.", "Reading is a skill that comes in layers. You're building one now."], rounds);
  return pick(["Hard rounds are where the learning happens. Try an easier one, or go slower.", "Nobody reads fluently on day one. Come back to it tomorrow and it will look friendlier.", "That was a tough one. The fact that you tried it counts."], rounds);
}

/** A gentle greeting when someone returns after a break. Never mentions a broken streak. */
export function welcomeBack(daysAway: number): string | null {
  if (daysAway >= 30) return "Welcome back. The piano kept your place.";
  if (daysAway >= 7) return "Good to see you again. A few minutes is plenty to start.";
  if (daysAway >= 3) return "Welcome back. Pick up wherever feels easy.";
  return null;
}
