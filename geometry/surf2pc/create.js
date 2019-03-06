import { identity } from '@jsxcad/math-mat4';

/**
 * Creates a new empty surface
 * This geometry does in-place canonicalization.
 * @returns {surface} a new empty surface
 */
export const create = () => ({
  __jsxcadTag__: '@jsxcad/geometry-surf2pc',
  basePolygons: [], // The untransformed, canonicalized geometry.
  polygons: [], // The transformed geometry when canonical.
  transforms: identity(),
  isCanonicalized: true, // Has no non-canonical elements.
  isFlipped: false // Flipped surfaces are wound backward
});
