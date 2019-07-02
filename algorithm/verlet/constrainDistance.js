import { add, scale, squaredDistance, subtract } from '@jsxcad/math-vec3';
import { ensureParticle } from './ensureParticle';

// Distance

const relax = ({ a, b, distance, stiffness }, stepCoefficient) => {
  const normal = subtract(a.position, b.position);
  let m = squaredDistance(normal, [0, 0, 0]);
  if (m === 0) {
    m = 1;
  }
  const scaledNormal = scale(((distance * distance - m) / m) * stiffness * stepCoefficient,
                             normal);
  a.position = add(a.position, scaledNormal);
  b.position = subtract(b.position, scaledNormal);
};

export const create = ({ constraints, ids, particles }) => {
  const constrain = (a, b, distance, stiffness = 0.5) => {
    constraints.push({
      a: ensureParticle(ids, particles, a),
      b: ensureParticle(ids, particles, b),
      distance,
      relax,
      stiffness
    });
  };
  return constrain;
};
