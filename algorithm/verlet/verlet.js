import { squaredDistance } from '@jsxcad/math-vec3';

const EPSILON2 = 1e-10;

const relax = (constraint, stepCoefficient) =>
  constraint.relax(constraint, stepCoefficient);

export const verlet = ({
  forces = [],
  ids = {},
  particles = [],
  constraints = [],
} = {}) => ({ forces, ids, particles: Object.values(particles), constraints });

export const positions = ({ particles }) => {
  const positions = {};
  for (const particle of particles) {
    positions[particle.id] = particle.position;
  }
  return positions;
};

export const update = ({ constraints, forces, particles }, step = 16) => {
  for (const particle of particles) {
    const { position } = particle;

    for (const force of forces) {
      force({ particle, particles });
    }

    particle.lastPosition = position;
  }

  // relax
  const stepCoefficient = 1 / step;

  for (let i = 0; i < step; i++) {
    for (const constraint of constraints) {
      relax(constraint, stepCoefficient);
    }
  }
};

export const isStopped = ({ particles }) => {
  return particles.every(
    ({ position, lastPosition }) =>
      squaredDistance(position, lastPosition) < EPSILON2
  );
};

export const solve = (verlet, stepLimit = 0) => {
  do {
    if (stepLimit > 0) {
      if (--stepLimit === 0) {
        return false;
      }
    }
    update(verlet);
  } while (!isStopped(verlet));
  return true;
};
