import { add, scale, subtract } from '@jsxcad/math-vec3';

export const force = ({ forces }, friction) => {
  const applyInertia = ({ particle }) => {
    const velocity = scale(friction, subtract(particle.position, particle.lastPosition));
    particle.position = add(particle.position, velocity);
  };
  forces.push(applyInertia);
};
