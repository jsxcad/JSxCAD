import { add } from '@jsxcad/math-vec3';

export const force = ({ forces }, vector) => {
  const applyGravity = ({ particle }) => {
    particle.position = add(particle.position, vector);
  };
  forces.push(applyGravity);
};
