import ClipperLib from 'clipper-lib';

const { IntPoint } = ClipperLib;

const toInt = (integer) => integer * 1e5;
const toFloat = (integer) => integer / 1e5;

export const fromSurface = (surface, normalize) => surface.map(path => path.map(point => { const [X, Y] = normalize(point); return new IntPoint(toInt(X), toInt(Y)); }));
export const toSurface = (paths, normalize) => paths.map(path => path.map(({ X, Y }) => { return normalize([toFloat(X), toFloat(Y)]); }));
