import ClipperLib from 'clipper-lib';

const { Clipper, IntPoint, PolyFillType } = ClipperLib;

const toInt = (integer) => Math.round(integer * 1e5);
const toFloat = (integer) => integer / 1e5;

export const fillType = PolyFillType.pftNonZero;

export const fromSurface = (surface, normalize) =>
  surface.map(path => path.map(point => { const [X, Y] = normalize(point); return new IntPoint(toInt(X), toInt(Y)); }));

export const toSurface = (clipper, op, normalize) => {
  // const result = new PolyTree();
  const result = [];
  clipper.Execute(op, result, fillType, fillType);
  const cleaned = Clipper.CleanPolygons(result, 10);
  return cleaned.map(path => path.map(({ X, Y }) => { return normalize([toFloat(X), toFloat(Y)]); }));
};
