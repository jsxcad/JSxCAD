import Prando from 'prando';

export const Random = (seed = 0) => {
  const rng = new Prando(seed);
  return () => rng.next();
};

export default Random;
