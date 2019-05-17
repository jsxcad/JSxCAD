import { Shape } from './Shape';
import { assemble } from './assemble';
import { buildConvexHull } from '@jsxcad/geometry-points';

export const chainHull = (...geometries) => {
  const points = geometries.map(geometry => geometry.toPoints().toGeometry().points);
  const chain = [];
  for (let nth = 1; nth < geometries.length; nth++) {
    chain.push(Shape.fromPolygonsToSolid(buildConvexHull({}, [...points[nth - 1], ...points[nth]])));
  }
  return assemble(...chain);
};
