import { Assembly, unionLazily } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';

export const union = (...params) => {
  switch (params.length) {
    case 0: {
      return CSG.fromPolygons([]);
    }
    case 1: {
      return params[0];
    }
    default: {
      return unionLazily(...params);
    }
  }
};

const method = function (...shapes) { return union(this, ...shapes); };

Assembly.prototype.union = method;
CAG.prototype.union = method;
CSG.prototype.union = method;
Path2D.prototype.union = method;
