import { chainHull } from './chainHull';
import { circle } from './circle';
import { planeX } from './plane';

/**
 *
 * # Torus
 *
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * torus({ thickness: 5,
 *         radius: 20 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [-80, -80, 80] } }
 * ```
 * torus({ thickness: 5,
 *         radius: 20,
 *         sides: 4,
 *         rotation: 45 })
 * ```
 * :::
 *
 **/

export const torus = ({ thickness = 1, radius = 1, segments = 32, sides = 32, rotation = 0 } = {}) => {
  const piece = circle({ radius: thickness, sides }).rotateZ(rotation).rotateX(90).translate(radius).cut(planeX())[0];
  const pieces = [];
  for (let angle = 0; angle < 361; angle += 360 / segments) {
    pieces.push(piece.rotateZ(angle));
  }
  return chainHull(...pieces);
};
