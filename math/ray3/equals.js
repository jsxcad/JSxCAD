import { distanceToPoint } from './distanceToPoint';
import { equals as equalsVec3 } from '@jsxcad/math-vec3';

const EPS = 1e-5;

/**
 * Compare the given 3D lines for equality
 *
 * @return {boolean} true if lines are equal
 */
export const equals = (line1, [point2, unit2]) => {
  const [, unit1] = line1;

  // compare directions (unit vectors)
  if (!equalsVec3(unit1, unit2)) return false;

  // See if the reference point of the second line is on the first line.
  let distance = distanceToPoint(point2, line1);
  if (distance >= EPS) return false;

  return true;
};
