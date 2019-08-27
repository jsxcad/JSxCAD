import { Shape } from './Shape';

/**
 *
 * # Plan
 *
 * Produces a plan based on marks that transform as geometry.
 *
 **/

export const plan = (options = {}) => {
  const { plan, marks } = options;
  // FIX: Add validation.
  return Shape.fromGeometry({ plan, marks });
};
