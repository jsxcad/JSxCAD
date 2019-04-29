import { Assembly } from './Assembly';
import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Points extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }
}

Points.fromGeometry = (geometry) => new Points(fromGeometry(geometry));
