import Shape from '@jsxcad/api-v1-shape';
import { rewrite } from '@jsxcad/geometry-tagged';

export const fuse = (shape, op = (_ => _)) =>
  Shape.fromGeometry(rewrite(shape.toKeptGeometry(),
                             (geometry, descend, walk) => {
                               if (geometry.item) {
                                 return walk(geometry.item);
                               } else {
                                 return descend();
                               }
                             }));

const fuseMethod = function (...args) { return fuse(this, ...args); };
Shape.prototype.fuse = fuseMethod;

fuse.signature = 'fuse(shape:Shape, op:function) -> Shapes';
fuseMethod.signature = 'Shape -> fuse(op:function) -> Shapes';

export default fuse;
