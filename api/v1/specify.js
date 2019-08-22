import { Shape, toGeometry } from './Shape';
import { specify as specifyGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Specify
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

export const specify = (...shapes) => {
  shapes = shapes.filter(shape => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(specifyGeometry({ assembly: [] }));
    }
    case 1: {
      return Shape.fromGeometry(specifyGeometry(toGeometry(shapes[0])));
    }
    default: {
      return Shape.fromGeometry(specifyGeometry({ assembly: shapes.map(toGeometry) }));
    }
  }
};

const method = function (...shapes) { return specify(this, ...shapes); };

Shape.prototype.specify = method;
