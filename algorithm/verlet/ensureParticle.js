import { particle } from './particle.js';

export const ensureParticle = (ids, particles, id) => {
  let p = ids[id];
  if (p === undefined) {
    p = particle(id, [Math.random() * 10, Math.random() * 10]);
    ids[id] = p;
    particles.push(p);
  }
  return p;
};
