import { equals } from '@jsxcad/math-vec3';

const relax = (constraint, stepCoefficient) => constraint.relax(constraint, stepCoefficient);

export const verlet = ({ forces = [], ids = {}, particles = [], constraints = [] } = {}) =>
  ({ forces, ids, particles: Object.values(particles), constraints });

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
  console.log(`QQ/particles: ${JSON.stringify(particles)}`);
  return particles.every(({ position, lastPosition }) => equals(position, lastPosition));
};

export const solve = (verlet) => {
  do {
    update(verlet);
  } while (!isStopped(verlet));
};
