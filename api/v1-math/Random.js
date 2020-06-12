import Prando from "prando";

const makeTo = (g) => (to) => g() * to;
const makeIn = (g) => (from, to) => g() * (to - from) + from;
const makeVary = (g) => (degree) => (g() - 0.5) * degree * 2;
const makePick = (g) => (options) => options[Math.floor(g() * options.length)];

export const Random = (seed = 0) => {
  const rng = new Prando(seed);
  const g = () => rng.next();
  g.in = makeIn(g);
  g.to = makeTo(g);
  g.vary = makeVary(g);
  g.pick = makePick(g);
  return g;
};

export default Random;
