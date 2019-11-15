import Shape from './Shape';
import assemble from './assemble';
import chainHull from './chainHull';
import union from './union';

/**
 *
 * # Fillet
 *
 * Fillets the top of a shape with the provided tool shape.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * const tool = hull(Point(0, 0, -1), Square(2));
 * assemble(Cube(20, 20, 5).below(),
 *          Cube(10, 10, 5).below().drop())
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
      const cut = [];
      for (const position of path) {
        if (position !== null) {
          cut.push(tool.translate(position));
        }
      }
      if (path[0] !== null) {
        // Handle closed paths.
        cut.push(tool.translate(path[0]));
      }
      cuts.push(chainHull(...cut));
    }
  }
  return assemble(shape, union(...cuts).drop());
};

const method = function (tool) { return fillet(this, tool); };

Shape.prototype.fillet = method;
