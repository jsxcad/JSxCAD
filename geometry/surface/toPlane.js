import { toPlane as toPlaneOfPolygon } from '@jsxcad/math-poly3';

export const toPlane = (surface) => toPlaneOfPolygon(surface[0]);
