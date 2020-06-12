import { ensureParticle } from "./ensureParticle";

// Pinning Constraint

const relax = ({ particle, position }, stepCoefficient) => {
  if (position[0] !== undefined) {
    particle.position[0] = position[0];
  }
  if (position[1] !== undefined) {
    particle.position[1] = position[1];
  }
  if (position[2] !== undefined) {
    particle.position[2] = position[2];
  }
};

export const create = ({ constraints, ids, particles }) => {
  const constrain = (particle, position) => {
    constraints.push({
      particle: ensureParticle(ids, particles, particle),
      position,
      relax,
    });
  };
  return constrain;
};
