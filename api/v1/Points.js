import { Assembly } from './Assembly';

export class Points extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  fromGeometry (geometry) {
    return Points.fromGeometry(geometry);
  }
}

Points.fromGeometry = (geometry) => new Solid(geometry);
