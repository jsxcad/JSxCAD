import { add, scale, subtract } from "@jsxcad/math-vec3";

export const force = ({ forces }, friction = 0.99) => {
  const applyInertia = ({ particle }) => {
    const velocity = scale(
      friction,
      subtract(particle.position, particle.lastPosition)
    );
    if (velocity > 1e-5) {
      particle.position = add(particle.position, velocity);
    }
  };
  forces.push(applyInertia);
};
