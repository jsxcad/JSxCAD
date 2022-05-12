import { toCgalTransformFromJsTransform, toJsTransformFromCgalTransform } from './transform.js';

import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const GEOMETRY_UNKNOWN = 0;
const GEOMETRY_MESH = 1;
const GEOMETRY_POLYGONS_WITH_HOLES = 2;
const GEOMETRY_SEGMENTS = 3;
const GEOMETRY_POINTS = 4;
const GEOMETRY_EMPTY = 5;

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
        console.log(`QQ/fillCgalGeometry/graph`);
        const { graph } = inputs[nth];
        geometry.setType(nth, GEOMETRY_MESH);
        geometry.setInputMesh(nth, toSurfaceMesh(graph));
        break;
      case 'polygonsWithHoles': {
        console.log(`QQ/fillCgalGeometry/pwh`);
        const { exactPlane, plane, polygonsWithHoles } = inputs[nth];
        let cursor = -1;
        geometry.setType(nth, GEOMETRY_POLYGONS_WITH_HOLES);
        geometry.fillPolygonsWithHoles(
          nth,
          (planeToFill) => {
            if (exactPlane) {
              const [a, b, c, d] = exactPlane;
              g.fillExactQuadruple(planeToFill, a, b, c, d);
            } else {
              const [x, y, z, w] = plane;
              g.fillQuadruple(planeToFill, x, y, z, -w);
            }
          },
          (boundaryToFill) => {
            cursor += 1;
            const polygon = polygonsWithHoles[cursor];
            if (polygon === undefined) {
              return false;
            }
            if (polygon.exactPoints) {
              for (const [x, y] of polygon.exactPoints) {
                try {
                boundaryToFill.addExact(x, y);
                } catch (error) { console.log(`QQ/polygon/addExact: ${JSON.stringify([x, y])}`); throw error; }
              }
            } else {
              for (const [x, y] of polygon.points) {
                boundaryToFill.add(x, y);
              }
            }
            return true;
          },
          (holeToFill, nthHole) => {
            const polygon = polygonsWithHoles[cursor];
            if (polygon === undefined) {
              return false;
            }
            const hole = polygon.holes[nthHole];
            if (hole === undefined) {
              return false;
            }
            if (hole.exactPoints) {
              for (const [x, y] of hole.exactPoints) {
                try {
                holeToFill.addExact(x, y);
                } catch (error) { console.log(`QQ/hole/addExact: ${JSON.stringify([x, y])}`); throw error; }
              }
            } else {
              for (const [x, y] of hole.points) {
                holeToFill.add(x, y);
              }
            }
            return true;
          }
        );
        break;
      }
      case 'segments': {
        console.log(`QQ/fillCgalGeometry/segments`);
        const { segments } = inputs[nth];
        geometry.setType(nth, GEOMETRY_SEGMENTS);
        for (const [[sX = 0, sY = 0, sZ = 0], [eX = 0, eY = 0, eZ = 0]] of segments) {
          try {
            geometry.addInputSegment(nth, sX, sY, sZ, eX, eY, eZ);
          } catch (error) {
            throw error;
          }
        }
        break;
      }
      case 'points': {
        const { exactPoints, points } = inputs[nth];
        geometry.setType(nth, GEOMETRY_POINTS);
        if (exactPoints) {
          for (const [x = '0', y = '0', z = '0'] of exactPoints) {
            geometry.addInputPointExact(nth, x, y, z);
          }
        } else if (points) {
          for (const [x = 0, y = 0, z = 0] of points) {
            geometry.addInputPoint(nth, x, y, z);
          }
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

export const fromCgalGeometry = (geometry, inputs, length = inputs.length, start = 0) => {
  const results = [];
  for (let nth = start; nth < length; nth++) {
    switch (geometry.getType(nth)) {
      case GEOMETRY_MESH: {
        const mesh = geometry.releaseOutputMesh(nth);
        mesh.provenance = 'fromCgalGeometry';
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[nth] || {};
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
        let exactPlane, plane, exactPoints, points, output;
        const outputPlane = (x, y, z, w, exactX, exactY, exactZ, exactW) => {
          plane = [x, y, z, w];
          exactPlane = [exactX, exactY, exactZ, exactW];
        };
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
        const outputPolygonPoint = (x, y, exactX, exactY) => {
          points.push([x, y]);
          exactPoints.push([exactX, exactY]);
        };
        geometry.emitPolygonsWithHoles(
          nth,
          outputPlane,
          outputPolygon,
          outputPolygonPoint
        );
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[nth] || {};
        results[nth] = {
          type: 'polygonsWithHoles',
          polygonsWithHoles,
          plane,
          exactPlane,
          matrix,
          tags,
        };
        break;
      }
      case GEOMETRY_SEGMENTS: {
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[nth] || {};
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
      case GEOMETRY_POINTS: {
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[nth] || {};
        const points = [];
        const exactPoints = [];
        results[nth] = {
          type: 'points',
          points,
          exactPoints,
          matrix,
          tags,
        };
        geometry.emitPoints(nth, (x, y, z, exactX, exactY, exactZ) => {
          points.push([x, y, z]);
          exactPoints.push([exactX, exactY, exactZ]);
        });
        break;
      }
      default:
      case GEOMETRY_EMPTY: {
        results[nth] = { type: 'group', content: [], tags: [] };
      }
    }
  }
  let output;
  if (start === 0) {
    output = results;
  } else {
    output = results.slice(start);
  }
  if (output.some(value => value === undefined)) {
    throw Error(`QQ/producing undefined output`);
  }
  return output;
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
