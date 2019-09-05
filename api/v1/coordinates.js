import { numbers } from './numbers';

/**
 *
 * # Coordinates
 *
 * ```
 * coordinates({ to: 3 }) is [[0], [1], [2]].
 * ```
 *
 **/

// FIX: Consider other cardinalities.
export const coordinates = (xSpec, ySpec, zSpec, thunk) => {
  const coordinates = [];
  numbers(xSpec, x => numbers(ySpec, y => numbers(zSpec, z => coordinates.push(thunk(x, y, z)))));
  return coordinates;
};
