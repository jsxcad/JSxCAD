import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize';
import { close } from './close';
import { concatenate } from './concatenate';
import { flip } from './flip';
import { isClosed } from './isClosed';
import { measureArea } from './measureArea';
import { open } from './open';
import { toGeneric } from './toGeneric';
import { toPolygon } from './toPolygon';
import { toSegments } from './toSegments';
import { toZ0Polygon } from './toZ0Polygon';
import { transform } from './transform';

export {
  canonicalize,
  close,
  concatenate,
  flip,
  isClosed,
  measureArea,
  open,
  toGeneric,
  toPolygon,
  toSegments,
  toZ0Polygon,
  transform
};

export const translate = (vector, path) => transform(fromTranslation(vector), path);
export const scale = (vector, path) => transform(fromScaling(vector), path);
