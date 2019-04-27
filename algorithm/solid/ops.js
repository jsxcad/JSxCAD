import { canonicalize as canonicalizeSurface, transform as transformSurface } from '@jsxcad/algorithm-surface';
import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';

export const transform = (matrix, solid) => solid.map(surface => transformSurface(matrix, surface));
export const translate = (vector, solid) => transform(fromTranslation(vector), solid);
export const scale = (vector, solid) => transform(fromScaling(vector), solid);
export const canonicalize = (solid) => solid.map(canonicalizeSurface);
