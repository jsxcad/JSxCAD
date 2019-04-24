import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { canonicalize } from './canonicalize';
import { flip } from './flip';
import { toComponents } from './toComponents';
import { toPaths } from './toPaths';
import { toSolid } from './toSolid';
import { toZ0Surface } from './toZ0Surface';
import { transform } from './transform';

export {
  canonicalize,
  flip,
  toComponents,
  toPaths,
  toSolid,
  toZ0Surface,
  transform
};

export const rotateX = (angle, assembly) => transform(fromXRotation(angle), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);
