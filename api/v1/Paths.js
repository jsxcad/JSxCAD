import { Assembly } from './Assembly';
import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Paths extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Paths.fromGeometry(geometry);
  }
}

Paths.fromGeometry = (geometry) => new Paths(geometry);
Paths.fromPaths = (paths) => new Paths(fromGeometry({ paths: paths }));
