import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const GEOMETRY_UNKNOWN = 0;
const GEOMETRY_MESH = 1;
const GEOMETRY_POLYGONS_WITH_HOLES = 2;
const GEOMETRY_SEGMENTS = 3;
// const GEOMETRY_POINTS = 4;

const X = 0;
const Y = 1;
const Z = 2;

export const fillCgalGeometry = (geometry, inputs) => {
  const g = getCgal();
  geometry.setSize(inputs.length);
  for (let nth = 0; nth < inputs.length; nth++) {
    geometry.setTransform(
      nth,
      toCgalTransformFromJsTransform(inputs[nth].matrix)
    );
    switch (inputs[nth].type) {
      case 'graph':
        geometry.setType(nth, GEOMETRY_MESH);
        geometry.setInputMesh(nth, toSurfaceMesh(inputs[nth].graph));
        break;
      case 'polygonsWithHoles': {
        let cursor = -1;
        geometry.setType(nth, GEOMETRY_POLYGONS_WITH_HOLES);
        geometry.fillPolygonsWithHoles(
          nth,
          (planeToFill) => {
            if (inputs[nth].exactPlane) {
              const [a, b, c, d] = inputs[nth].exactPlane;
              g.fillExactQuadruple(planeToFill, a, b, c, d);
            } else {
              const [x, y, z, w] = inputs[nth].plane;
              g.fillQuadruple(planeToFill, x, y, z, -w);
            }
          },
          (boundaryToFill) => {
            cursor += 1;
            const polygon = inputs[nth].polygonsWithHoles[cursor];
            if (polygon === undefined) {
              return false;
            }
            if (polygon.exactPoints) {
              for (const [x, y, z] of polygon.exactPoints) {
                g.addExactPoint(boundaryToFill, x, y, z);
              }
            } else {
              for (const [x, y, z] of polygon.points) {
                g.addPoint(boundaryToFill, x, y, z);
              }
            }
            return true;
          },
          (holeToFill, nthHole) => {
            const polygon = inputs[nth].polygonsWithHoles[cursor];
            if (polygon === undefined) {
              return false;
            }
            const hole = polygon.holes[nthHole];
            if (hole === undefined) {
              return false;
            }
            if (hole.exactPoints) {
              for (const [x, y, z] of hole.exactPoints) {
                g.addExactPoint(holeToFill, x, y, z);
              }
            } else {
              for (const [x, y, z] of hole.points) {
                g.addPoint(holeToFill, x, y, z);
              }
            }
            return true;
          }
        );
        break;
      }
      case 'segments': {
        geometry.setType(nth, GEOMETRY_SEGMENTS);
        for (const [start, end] of inputs[nth].segments) {
          geometry.addInputSegment(nth, start[X], start[Y], start[Z], end[X], end[Y], end[Z]);
        }
        break;
      }
      default: {
        geometry.setType(nth, GEOMETRY_UNKNOWN);
        break;
      }
    }
  }
  return geometry;
};

export const toCgalGeometry = (inputs, g = getCgal()) => {
  const cgalGeometry = new (g.Geometry)();
  fillCgalGeometry(cgalGeometry, inputs);
  return cgalGeometry;
};

export const fromCgalGeometry = (geometry, inputs, length = inputs.length) => {
  const results = [];
  for (let nth = 0; nth < length; nth++) {
    switch (geometry.getType(nth)) {
      case GEOMETRY_MESH: {
        const mesh = geometry.releaseOutputMesh(nth);
        mesh.provenance = 'fromOutputGeometry';
        const { matrix, tags } = inputs[nth];
        // Note: The 0th mesh is not emitted as it does not get cut.
        results[nth] = {
          type: 'graph',
          matrix,
          tags,
          graph: fromSurfaceMesh(mesh),
        };
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const polygonsWithHoles = [];
        let exactPoints, points, output;
        const outputPolygon = (isHole) => {
          points = [];
          exactPoints = [];
          if (isHole) {
            output.holes.push({
              points,
              exactPoints,
              holes: [],
            });
          } else {
            output = {
              points,
              exactPoints,
              holes: [],
            };
            polygonsWithHoles.push(output);
          }
        };
        const outputPolygonPoint = (x, y, z, exactX, exactY, exactZ) => {
          points.push([x, y, z]);
          exactPoints.push([exactX, exactY, exactZ]);
        };
        geometry.emitPolygonsWithHoles(
          nth,
          outputPolygon,
          outputPolygonPoint
        );
        const { matrix, tags, plane = [0, 0, 1, 0] } = inputs[nth];
        results[nth] = {
          type: 'polygonsWithHoles',
          polygonsWithHoles,
          plane,
          matrix,
          tags,
        };
        break;
      }
      case GEOMETRY_SEGMENTS: {
        const { matrix, tags } = inputs[nth];
        const segments = [];
        results[nth] = {
          type: 'segments',
          segments,
          matrix,
          tags,
        };
        geometry.emitSegments(nth, (sX, sY, sZ, tX, tY, tZ) => {
          segments.push([[sX, sY, sZ], [tX, tY, tZ]]);
        });
        break;
      }
      default: {
        const { matrix, tags } = inputs[nth];
        results[nth] = { type: 'group', tags, matrix, contents: [] };
      }
    }
  }
  return results;
};

export const withCgalGeometry = (inputs, op) => {
  const g = getCgal();
  const cgalGeometry = toCgalGeometry(inputs, g);
  try {
    return op(cgalGeometry, g);
  } catch (error) {
    throw Error(error);
  } finally {
    cgalGeometry.delete();
  }
};

export { getCgal };
