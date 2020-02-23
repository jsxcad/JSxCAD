import Prando from 'prando';

const to = (g) => (to) => g() * to;
const vary = (g) => (degree) => (g() - 0.5) * degree * 2;

export const Random = (seed = 0) => {
  const rng = new Prando(seed);
  const g = () => rng.next();
  g.to = to(g);
  g.vary = vary(g);
  return g;
};

export default Random;
