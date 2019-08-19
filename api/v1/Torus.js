import { Circle } from './Circle';
import { lathe } from './lathe';

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

export const Torus = ({ thickness = 1, radius = 1, segments = 16, sides = 16, rotation = 0 } = {}) =>
  lathe({ sides: segments },
        Circle({ sides, radius: thickness })
          .rotateZ(rotation)
          .move(0, radius))
    .rotateY(90)
