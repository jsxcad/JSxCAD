import { angleRadians } from './angleRadians.js';
import { radToDeg } from '@jsxcad/math-utils';

export const angleDegrees = (vector) => radToDeg(angleRadians(vector));
