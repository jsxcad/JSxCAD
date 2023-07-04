import { add, scale, subtract } from './vector.js';

import { measureBoundingBox } from './measureBoundingBox.js';
import { taggedPoints } from './tagged/taggedPoints.js';
import { translate } from './translate.js';

const X = 0;
const Y = 1;
const Z = 2;

const MIN = 0;
const MAX = 1;

// Round to the nearest 0.001 mm

const round = (v) => Math.round(v * 1000) / 1000;

const roundCoordinate = ([x, y, z]) => [round(x), round(y), round(z)];

const computeOffset = (geometry, spec, origin) => {
  const boundingBox = measureBoundingBox(geometry);
  if (boundingBox === undefined) {
    return [0, 0, 0];
  }
  const max = roundCoordinate(boundingBox[MAX]);
  const min = roundCoordinate(boundingBox[MIN]);
  const center = roundCoordinate(scale(0.5, add(min, max)));
  const offset = [0, 0, 0];
  let index = 0;
  while (index < spec.length) {
    switch (spec[index++]) {
      case 'x': {
        switch (spec[index]) {
          case '>':
            offset[X] = -min[X];
            index += 1;
            break;
          case '<':
            offset[X] = -max[X];
            index += 1;
            break;
          default:
            offset[X] = -center[X];
        }
        break;
      }
      case 'y': {
        switch (spec[index]) {
          case '>':
            offset[Y] = -min[Y];
            index += 1;
            break;
          case '<':
            offset[Y] = -max[Y];
            index += 1;
            break;
          default:
            offset[Y] = -center[Y];
        }
        break;
      }
      case 'z': {
        switch (spec[index]) {
          case '>':
            offset[Z] = -min[Z];
            index += 1;
            break;
          case '<':
            offset[Z] = -max[Z];
            index += 1;
            break;
          default:
            offset[Z] = -center[Z];
        }
        break;
      }
    }
  }
  if (!offset.every(isFinite)) {
    throw Error(`Non-finite/offset: ${offset}`);
  }
  return offset;
};

export const alignment = (geometry, spec = 'xyz', origin = [0, 0, 0]) => {
  const offset = computeOffset(geometry, spec, origin);
  const reference = translate(
    taggedPoints({}, [[0, 0, 0]]),
    subtract(offset, origin)
  );
  return reference;
};
