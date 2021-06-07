import { reify } from './reify.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';

export const toConcreteGeometry = (geometry) =>
  toTransformedGeometry(reify(geometry));
