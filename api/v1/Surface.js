import { Assembly } from './Assembly';

export class Surface extends Assembly {
  constructor (geometry) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Surface.fromGeometry(geometry);
  }
}

Surface.fromGeometry = (geometry) => new Surface(geometry);
Surface.fromPaths = (paths) => new Surface({ paths: paths });
