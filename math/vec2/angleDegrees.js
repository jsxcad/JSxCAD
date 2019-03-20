import { angleRadians } from './angleRadians';
import { radToDeg } from '@jsxcad/math-utils';

export const angleDegrees = (vector) => radToDeg(angleRadians(vector));
