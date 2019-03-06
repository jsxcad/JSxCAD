import { canonicalize } from './canonicalize';
import { clone } from './clone';

/**
 * Flipping a surface affects how its interchange representations are wound.
 * A flipped surface will be wound backward (CW to CCW, CCW to CW).
 * A surface and its flipped counterpart will compare unequal.
 * @param {surface} surface - the surface to flip.
 * @returns {surface} the flipped surface.
 */
export const flip = (surface) => {
  const flipped = clone(canonicalize(surface));
  flipped.isFlipped = !surface.isFlipped;
  return flipped;
};
