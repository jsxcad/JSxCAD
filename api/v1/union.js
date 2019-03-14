import { Assembly, unionLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { flatten } from './flatten';

/*
  union (...shapes) {
    return CAG.fromGeometry(this.geometry.union(...shapes.map(toGeometry)));
  }
*/

export const union = (...params) => {
  const [shape, ...shapes] = flatten(params);
  return unionLazily(...shapes);
};

Assembly.prototype.union = union;
CAG.prototype.union = union;
CSG.prototype.union = union;
