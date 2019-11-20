import Shape from './Shape';
import { alignVertices } from '@jsxcad/geometry-solid';
import { getSolids } from '@jsxcad/geometry-tagged';

export const faces = (shape, xform = (_ => _)) => {
  let nextFaceId = 0;
  const faces = new Set();
  const vertexFaces = new Map();
  const rememberFace = (vertex, face) => {
    if (!faces.has(face)) {
      faces.add(face);
      face.faceId = nextFaceId++;
      face.faceNeighbors = new Set();
    }
    if (!vertexFaces.has(vertex)) {
      vertexFaces.set(vertex, []);
    }
    vertexFaces.get(vertex).push(face);
  };
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    const alignedSolid = alignVertices(solid);
    for (const surface of alignedSolid) {
      for (const face of surface) {
        for (const vertex of face) {
          rememberFace(vertex, face);
        }
      }
    }
  }
  for (const face of faces) {
    for (const vertex of face) {
      for (const neighbor of vertexFaces.get(vertex)) {
        if (neighbor !== face) {
          for (const neighborVertex of neighbor) {
            if (vertex !== neighborVertex) {
              if (vertexFaces.get(neighborVertex).includes(face)) {
                face.faceNeighbors.add(neighbor);
              }
            }
          }
        }
      }
    }
  }
  return [...faces].map(xform);
};

const facesMethod = function (...args) { return faces(this, ...args); };
Shape.prototype.faces = facesMethod;

export default faces;
