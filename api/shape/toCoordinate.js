import Shape from './Shape.js';

export const toCoordinate = (x) => {
  if (x instanceof Shape) {
    const g = x.toTransformedGeometry();
    if (g.type === 'points' && g.points.length === 1) {
      // FIX: Consider how this might be more robust.
      return g.points[0];
    }
  } else if (x instanceof Array) {
    return x;
  }
};
