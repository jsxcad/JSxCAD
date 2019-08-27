import { Shape, toGeometry } from './Shape';
import { addTags, specify as specifyGeometry } from '@jsxcad/geometry-tagged';

/**
 *
 * # Specify
 *
 * Encapsulates a geometry as a discrete item.
 *
 **/

export const specify = (specification, ...shapes) => {
  shapes = shapes.filter(shape => shape !== undefined);
  let geometry;
  switch (shapes.length) {
    case 0: {
      geometry = specifyGeometry({ assembly: [] });
    }
    case 1: {
      geometry = specifyGeometry(toGeometry(shapes[0]));
    }
    default: {
      geometry = specifyGeometry({ assembly: shapes.map(toGeometry) });
    }
  }
  return Shape.fromGeometry(addTags([`item/${JSON.stringify(specification)}`], geometry));
};

const method = function (...shapes) { return specify(this, ...shapes); };

Shape.prototype.specify = method;
