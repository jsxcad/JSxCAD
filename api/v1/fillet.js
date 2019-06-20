import { Shape } from './Shape';
import { assemble } from './assemble';
import { chainHull } from './chainHull';

/**
 *
 * # Fillet
 *
 * Fillets the top of a shape with the provided tool shape.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * const tool = hull(point(0, 0, -1), square(2));
 * assemble(cube(20, 20, 5).below(),
 *          cube(10, 10, 5).below().drop())
 *   .fillet(tool);
 * ```
 * :::
 *
 **/

export const fillet = (shape, tool) => {
  // FIX: Identify surface to fillet properly.
  const [, , z] = shape.measureBoundingBox()[1];
  const cuts = [];
  // Fix Remove the 0.1 z offsets.
  for (const pathset of shape.section({ z: z - 0.1 }).outline().getPathsets()) {
    for (const path of pathset) {
      cuts.push(chainHull(...path.map(([x, y, z]) =>
        tool.translate(x, y, z + 0.1))));
    }
  }
  return assemble(shape, assemble(...cuts).drop());
};

const method = function (tool) { return fillet(this, tool); };

Shape.prototype.fillet = method;
