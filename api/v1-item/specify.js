import { Shape, toGeometry } from './Shape';
import {
  rewriteTags,
  specify as specifyGeometry,
} from '@jsxcad/geometry-tagged';

/**
 *
 * # Specify
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

// DEPRECATED: See 'Item'.
export const specify = (specification, ...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  let geometry;
  switch (shapes.length) {
    case 0: {
      geometry = specifyGeometry({ assembly: [] });
      break;
    }
    case 1: {
      geometry = specifyGeometry(toGeometry(shapes[0]));
      break;
    }
    default: {
      geometry = specifyGeometry({ assembly: shapes.map(toGeometry) });
      break;
    }
  }
  return Shape.fromGeometry(
    rewriteTags([`item/${JSON.stringify(specification)}`], [], geometry)
  );
};

const method = function (specification) {
  return specify(specification, this);
};
Shape.prototype.specify = method;

export default specify;
