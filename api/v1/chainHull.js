import { Shape } from './Shape';
import { assemble } from './assemble';
import { buildConvexHull } from '@jsxcad/geometry-points';
import { toPoints } from '@jsxcad/geometry-eager';

export const chainHull = (...shapes) => {
  const pointsets = shapes.map(shape => toPoints({}, shape.toGeometry()).points);
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    chain.push(Shape.fromPolygonsToSolid(buildConvexHull({}, [...pointsets[nth - 1], ...pointsets[nth]])));
  }
  return assemble(...chain);
};
