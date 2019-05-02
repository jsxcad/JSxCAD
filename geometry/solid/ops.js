import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';

import { transform as transformSurface } from '@jsxcad/geometry-surface';

export const transform = (matrix, solid) => solid.map(surface => transformSurface(matrix, surface));
export const translate = (vector, solid) => transform(fromTranslation(vector), solid);
export const scale = (vector, solid) => transform(fromScaling(vector), solid);
