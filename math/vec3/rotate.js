import { rotateX } from './rotateX';
import { rotateY } from './rotateY';
import { rotateZ } from './rotateZ';
/**
 * Rotate vector 3D vector around the all 3 axes in the order x-axis , yaxis, z axis
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
// FIX: Why does this function even exist?
export function rotate (angle, vector) {
  // FIXME: not correct
  const origin = [0, 0, 0];
  return rotateZ(angle[2], origin, rotateY(angle[1], origin, rotateX(angle[0], origin, vector)));
}
