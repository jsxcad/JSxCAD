import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { transform as transformSurface } from '@jsxcad/geometry-surface';

export const multiply = (matrix, solid) => solid.map(surface => transformSurface(matrix, surface));

export const rotateX = (radians, solid) => multiply(fromXRotation(radians), solid);
export const rotateY = (radians, solid) => multiply(fromYRotation(radians), solid);
export const rotateZ = (radians, solid) => multiply(fromZRotation(radians), solid);
export const scale = (vector, solid) => multiply(fromScaling(vector), solid);
export const translate = (vector, solid) => multiply(fromTranslation(vector), solid);
