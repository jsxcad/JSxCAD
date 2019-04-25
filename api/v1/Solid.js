import { Assembly } from './Assembly';
import { fromPolygons } from '@jsxcad/algorithm-solid';

export class Solid extends Assembly {
  constructor (geometry) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Solid.fromGeometry(geometry);
  }
}

Solid.fromGeometry = (geometry) => new Solid(geometry);
Solid.fromPolygons = (polygons) => new Solid({ solid: fromPolygons({}, polygons) });
Solid.fromSurfaces = (surfaces) => new Solid({ solid: surfaces });
