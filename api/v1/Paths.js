import { Assembly } from './Assembly';
import { close, concatenate } from '@jsxcad/algorithm-path';
import { fromGeometry } from '@jsxcad/geometry-assembly';

const isSingleOpenPath = ({ paths }) => (paths.length == 1) && (paths[0][0] === null);

export class Paths extends Assembly {
  constructor (geometry = fromGeometry({ assembly: [] })) {
    super(geometry);
  }

  concat (...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toPaths();
      if (!isSingleOpenPath(geometry)) {
        throw Error('Concatenation requires single open paths.');
      }
      paths.push(geometry.paths[0]);
    }
    return Paths.fromOpenPath(concatenate(...paths));
  }

  close () {
console.log(`QQ/Paths/close/this: ${JSON.stringify(this)}`);
    const paths = this.toPaths();
    if (!isSingleOpenPath(paths)) {
      throw Error('Close requires a single open path.');
    }
    return Paths.fromClosedPath(close(paths[0]));
  }

  fromGeometry (geometry) {
    return Paths.fromGeometry(geometry);
  }
}

Paths.fromGeometry = (geometry) => new Paths(geometry);
Paths.fromClosedPath = (closedPath) => new Paths(fromGeometry({ paths: [closedPath] }));
Paths.fromOpenPath = (openPath) => {
  if (openPath[0] === null) {
    return new Paths(fromGeometry({ paths: [openPath] }));
  } else {
    return new Paths(fromGeometry({ paths: [[null, ...openPath]] }));
  }
}
Paths.fromPaths = (paths) => new Paths(fromGeometry({ paths: paths }));
