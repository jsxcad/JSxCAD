import { Assembly } from './Assembly';

export class Solid extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Solid.fromGeometry(geometry);
  }
}

Solid.fromGeometry = (geometry) => new Solid(geometry);
Solid.fromPolygons = (polygons) => new Solid({ solid: fromPolygons(polygons) });
Solid.fromSurfaces = (surfaces) => new Solid({ solid: surfaces });
