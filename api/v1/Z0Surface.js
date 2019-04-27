import { Assembly } from './Assembly';
import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Z0Surface extends Assembly {
  constructor (geometry) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Z0Surface.fromGeometry(geometry);
  }
}

Z0Surface.fromGeometry = (geometry) => new Z0Surface(geometry);
Z0Surface.fromPaths = (paths) => new Z0Surface(fromGeometry({ z0Surface: paths }));
Z0Surface.fromPolygons = (polygons) => new Z0Surface(fromGeometry({ z0Surface: polygons }));
