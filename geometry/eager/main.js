import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { addTag } from './addTag';
import { assemble } from './assemble';
import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { eachItem } from './eachItem';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { intersection } from './intersection';
import { toComponents } from './toComponents';
import { toDisjointGeometry } from './toDisjointGeometry';
import { toPaths } from './toPaths';
import { toPoints } from './toPoints';
import { toSolid } from './toSolid';
import { toZ0Surface } from './toZ0Surface';
import { transform } from './transform';
import { union } from './union';

export {
  addTag,
  assemble,
  canonicalize,
  difference,
  eachItem,
  eachPoint,
  flip,
  intersection,
  toComponents,
  toDisjointGeometry,
  toPaths,
  toPoints,
  toSolid,
  toZ0Surface,
  transform,
  union
};

export const rotateX = (angle, assembly) => transform(fromXRotation(angle), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);
