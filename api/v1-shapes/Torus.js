import { Circle } from './Circle';

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

export const Torus = (
  radius = 1,
  height = 1,
  { segments = 32, sides = 32, rotation = 0 } = {}
) =>
  Circle(height / 2, { sides })
    .rotateZ(rotation)
    .moveY(radius)
    .Loop(360, { sides: segments })
    .rotateY(90);

export default Torus;
