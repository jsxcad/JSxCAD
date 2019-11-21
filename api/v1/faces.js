import { addTags, allTags, getSolids } from '@jsxcad/geometry-tagged';
import { normalize, subtract } from '@jsxcad/math-vec3';

import Connector from './Connector';
import Polygon from './Polygon';
import Shape from './Shape';
import { alignVertices } from '@jsxcad/geometry-solid';
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
        const faceShape = Polygon.ofPoints(face);
        const connectors = [];
        const tags = [];
        tags.push(`face/id:${nextFaceId++}`);
        let lastPoint = face[face.length - 1];
        for (const nextPoint of face) {
          const edgeId = `face/edge:${ensurePointId(nextPoint)}:${ensurePointId(lastPoint)}`;
          tags.push(edgeId);
          // Make sure axis extends beyond end.
          const origin = nextPoint;
          const axis = subtract(nextPoint, normalize(subtract(nextPoint, lastPoint)));
          const orientation = subtract(nextPoint, normalize(plane));
          const end = lastPoint;
          connectors.push(Connector(edgeId, { origin, axis, orientation, end }));
          lastPoint = nextPoint;
        }
        faces.push(Shape.fromGeometry(addTags(tags, faceShape.op(op).toGeometry()))
            .with(...connectors));
      }
    }
  }
  return faces;
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

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
