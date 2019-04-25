import { Assembly } from './Assembly';

export class Paths extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Paths.fromGeometry(geometry);
  }
}

Paths.fromGeometry = (geometry) => new Paths(geometry);
Paths.fromPaths = (paths) => new Solid({ paths: paths });
