import { Assembly } from './Assembly';

export class Surface extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Surface.fromGeometry
  }
}

Surface.fromGeometry = (geometry) => new Surface(geometry);
Surface.fromPaths = (paths) => new Surface({ paths: paths });
