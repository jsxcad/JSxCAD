import ClipperLib from 'clipper-lib';

const { IntPoint } = ClipperLib;

const toInt = (float) => Math.round(float * 1e5);
const toFloat = (integer) => integer / 1e5;

export const fromSurface = (surface) => surface.map(path => path.map(([X, Y]) => (new IntPoint(toInt(X), toInt(Y)))));
export const toSurface = (paths) => paths.map(path => path.map(({ X, Y }) => [toFloat(X), toFloat(Y), 0]));
