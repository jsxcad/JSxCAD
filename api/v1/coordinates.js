import numbers from './numbers';

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
export const coordinates = (xSpec, ySpec, zSpec, op) => {
  const coordinates = [];
  numbers(xSpec, x => numbers(ySpec, y => numbers(zSpec, z => coordinates.push(op(x, y, z)))));
  return coordinates;
};

export default coordinates;

coordinates.signature = 'coordinates(xSpec, ySpec, zSpec, op) -> coordinates';
