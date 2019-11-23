import Shape from './Shape';
import { alignVertices } from '@jsxcad/geometry-solid';
import { getEdges } from '@jsxcad/geometry-path';
import { getSolids } from '@jsxcad/geometry-tagged';

export const edges = (shape, op = (_ => _)) => {
  const edgeId = (from, to) => `${JSON.stringify(from)}->${JSON.stringify(to)}`;
  const edges = new Map();
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const alignedSolid = alignVertices(solid);
    for (const surface of alignedSolid) {
      for (const face of surface) {
        for (const [lastPoint, nextPoint] of getEdges(face)) {
          const [a, b] = [lastPoint, nextPoint].sort();
          edges.set(edgeId(a, b), [a, b]);
        }
      }
    }
  }
  return [...edges.values()];
};

const edgesMethod = function (...args) { return edges(this, ...args); };
Shape.prototype.edges = edgesMethod;

export default edges;
