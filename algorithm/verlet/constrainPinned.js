import { ensureParticle } from './ensureParticle';

// Pinning Constraint

const relax = ({ particle, position }, stepCoefficient) => {
  particle.position = position;
};

export const create = ({ constraints, ids, particles }) => {
  const constrain = (particle, position) => {
    constraints.push({
      particle: ensureParticle(ids, particles, particle),
      position,
      relax
    });
  };
  return constrain;
};
