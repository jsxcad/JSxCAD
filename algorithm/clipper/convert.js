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
  const cleaned = Clipper.CleanPolygons(result, 1);
  // CHECK: Do we need to renormalize here?
  const surface = [];
  for (const path of cleaned) {
    if (path.length > 0) {
      surface.push(path.map(({ X, Y }) => normalize([toFloat(X), toFloat(Y)])));
    }
  }
  return surface;
};
