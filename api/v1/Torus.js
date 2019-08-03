import { Circle } from './Circle';
import { chainHull } from './chainHull';
import { planeX } from './plane';

/**
 *
 * # Torus
 *
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * Torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4,
 *         rotation: 45 })
 * ```
 * :::
 *
 **/

// FIX: Use lathe instead of chainhull.
export const Torus = ({ thickness = 1, radius = 1, segments = 16, sides = 16, rotation = 0 } = {}) => {
  const piece = Circle({ radius: thickness, sides }).rotateZ(rotation).rotateX(90).translate(radius).cut(planeX())[0];
  const pieces = [];
  for (let angle = 0; angle < 361; angle += 360 / segments) {
    pieces.push(piece.rotateZ(angle));
  }
  return chainHull(...pieces);
};
