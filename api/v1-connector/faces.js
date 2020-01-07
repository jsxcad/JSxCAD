import { add, scale } from '@jsxcad/math-vec3';
import { allTags, getSolids, rewriteTags } from '@jsxcad/geometry-tagged';

import Connector from './Connector';
import Polygon from './Polygon';
import Shape from './Shape';
import { alignVertices } from '@jsxcad/geometry-solid';
import { getEdges } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

export const faces = (shape, op = (_ => _)) => {
  let nextFaceId = 0;
  let nextPointId = 0;
  const pointIds = new Map();
  const ensurePointId = (point) => {
    const pointId = pointIds.get(point);
    if (pointId === undefined) {
      pointIds.set(point, nextPointId);
      return nextPointId++;
    } else {
      return pointId;
    }
  };
  const faces = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const alignedSolid = alignVertices(solid);
    for (const surface of alignedSolid) {
      for (const face of surface) {
        const plane = toPlane(face);
        const connectors = [];
        const tags = [];
        tags.push(`face/id:${nextFaceId++}`);
        for (const [lastPoint, nextPoint] of getEdges(face)) {
          const edgeId = `face/edge:${ensurePointId(nextPoint)}:${ensurePointId(lastPoint)}`;
          tags.push(edgeId);
          const center = scale(0.5, add(nextPoint, lastPoint));
          const right = add(plane, center);
          const up = add(plane, nextPoint);
          connectors.push(Connector(edgeId,
                                    {
                                      plane: toPlane([up, nextPoint, lastPoint]),
                                      center,
                                      right,
                                      start: lastPoint,
                                      end: nextPoint
                                    }));
        }
        faces.push(Shape.fromGeometry(rewriteTags(tags, [], Polygon.ofPoints(face).op(op).toGeometry()))
            .with(...connectors));
      }
    }
  }
  return faces;
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.connectedFaces = facesMethod;

export default faces;

export const faceId = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('face/id:'))
      .map(tag => tag.substring(8));

const faceIdMethod = function () { return faceId(this); };
Shape.prototype.faceId = faceIdMethod;

export const faceEdges = (shape) =>
  [...allTags(shape.toGeometry())]
      .filter(tag => tag.startsWith('face/edge:'))
      .map(tag => tag.substring(10));

const faceEdgesMethod = function () { return faceEdges(this); };
Shape.prototype.faceEdges = faceEdgesMethod;
