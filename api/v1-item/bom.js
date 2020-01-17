import Shape from '@jsxcad/api-v1-shape';
import { visit } from '@jsxcad/geometry-tagged';

/**
 *
 * # Bill Of Materials
 *
 **/

export const bom = (shape) => {
  const bom = [];
  visit(shape.toKeptGeometry(),
        (geometry, descend) => {
          if (geometry.item) {
            bom.push(geometry.tags.filter(tag => tag.startsWith('item/'))
                .map(tag => tag.substring(5)));
          }
          descend();
        });
  return bom;
};

const bomMethod = function (...args) { return bom(this, ...args); };
Shape.prototype.bom = bomMethod;

bomMethod.signature = 'Shape -> bom() -> string';

export default bom;
