/* globals WeakRef */

import { toCgalTransformFromJsTransform, toJsTransformFromCgalTransform } from './transform.js';

import { computeHash } from '@jsxcad/sys';
import { getCgal } from './getCgal.js';

export const GEOMETRY_UNKNOWN = 0;
export const GEOMETRY_MESH = 1;
export const GEOMETRY_POLYGONS_WITH_HOLES = 2;
export const GEOMETRY_SEGMENTS = 3;
export const GEOMETRY_POINTS = 4;
export const GEOMETRY_EMPTY = 5;
export const GEOMETRY_REFERENCE = 6;
export const GEOMETRY_EDGES = 7;

const meshCache = new WeakMap();
const occtShapeCache = new Map();

export const clearMeshCache = () => {
  console.log(`QQ/clearMeshCache/noop`);
};

export const getCachedMesh = (key, mesh) => {
  const ref = meshCache.get(key);
  if (ref === undefined) {
    return;
  }
  return ref.deref();
};

export const setCachedMesh = (key, mesh) => {
  const ref = new WeakRef(mesh);
  meshCache.set(key, ref);
};

let testMode = false;

export const setTestMode = (mode) => { testMode = mode; };

export const fillCgalGeometry = (geometry, inputs) => {
  geometry.setSize(inputs.length);
  if (testMode) {
    geometry.setTestMode(testMode);
  }
  for (let nth = 0; nth < inputs.length; nth++) {
    const { tags = [] } = inputs[nth];
    geometry.setTransform(
      nth,
      toCgalTransformFromJsTransform(inputs[nth].matrix)
    );
    if (tags.includes('type:reference')) {
      geometry.setType(nth, GEOMETRY_REFERENCE);
      continue;
    }
    switch (inputs[nth].type) {
      case 'graph':
        const { graph } = inputs[nth];
        geometry.setType(nth, GEOMETRY_MESH);
        let mesh = getCachedMesh(graph);
        if (mesh) {
          geometry.setInputMesh(nth, mesh);
        } else if (graph.serializedSurfaceMesh) {
          geometry.deserializeInputMesh(nth, graph.serializedSurfaceMesh);
        } else {
          // throw Error(`Cannot deserialize surface mesh: ${JSON.stringify(inputs[nth])}`);
        }
        let occt = occtShapeCache.get(graph);
        if (occt) {
          geometry.setOcctShape(nth, occt);
        } else if (graph.serializedOcctShape) {
          geometry.deserializeOcctShape(nth, graph.serializedOcctShape);
        } else {
          // throw Error(`Cannot deserialize occt shape: ${JSON.stringify(inputs[nth])}`);
        }
        break;
      case 'polygonsWithHoles': {
        const { exactPlane, plane, polygonsWithHoles } = inputs[nth];
        geometry.setType(nth, GEOMETRY_POLYGONS_WITH_HOLES);
        if (exactPlane) {
          const [a, b, c, d] = exactPlane;
          geometry.setPolygonsPlaneExact(nth, a, b, c, d);
        } else {
          const [x, y, z, w] = plane;
          geometry.setPolygonsPlane(nth, x, y, z, w);
        }
        for (const polygon of polygonsWithHoles) {
          geometry.addPolygon(nth);
          if (polygon.exactPoints) {
            for (const [x, y] of polygon.exactPoints) {
              geometry.addPolygonPointExact(nth, x, y);
            }
          } else {
            for (const [x, y] of polygon.points) {
              geometry.addPolygonPoint(nth, x, y);
            }
          }
          for (const hole of polygon.holes) {
            geometry.addPolygonHole(nth);
            if (hole.exactPoints) {
              for (const [x, y] of hole.exactPoints) {
                geometry.addPolygonHolePointExact(nth, x, y);
              }
            } else {
              for (const [x, y] of hole.points) {
                geometry.addPolygonHolePoint(nth, x, y);
              }
            }
          }
        }
        break;
      }
      case 'segments': {
        const { segments } = inputs[nth];
        geometry.setType(nth, GEOMETRY_SEGMENTS);
        for (const [[sX = 0, sY = 0, sZ = 0], [eX = 0, eY = 0, eZ = 0], exact] of segments) {
          try {
            if (exact) {
              geometry.addInputSegmentExact(nth, exact);
            } else {
              geometry.addInputSegment(nth, sX, sY, sZ, eX, eY, eZ);
            }
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
          for (const exact of exactPoints) {
            try {
              geometry.addInputPointExact(nth, exact);
            } catch (error) {
              console.log(`QQ/exact: ${JSON.stringify(exact)}`);
              throw error;
            }
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
  const cgalGeometry = new (g.EmGeometry)();
  fillCgalGeometry(cgalGeometry, inputs);
  return cgalGeometry;
};

export const fromCgalGeometry = (geometry, inputs, length = inputs.length, start = 0, copyOriginal = false) => {
  const g = getCgal();
  const results = [];
  for (let nth = start; nth < length; nth++) {
    const origin = copyOriginal ? geometry.getOrigin(nth) : nth;
    switch (geometry.getType(nth)) {
      case GEOMETRY_MESH: {
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        let { tags = [], graph } = inputs[origin] || {};
        let update = false;
        let newMesh;
        let serializedSurfaceMesh;
        let newOcctShape;
        let serializedOcctShape;
        if (geometry.has_mesh(nth)) {
          const oldMesh = getCachedMesh(graph);
          newMesh = geometry.getMesh(nth);
          if (newMesh === oldMesh) {
            serializedSurfaceMesh = graph.serializedSurfaceMesh;
          } else {
            serializedSurfaceMesh = geometry.getSerializedMesh(nth);
            update = true;
          }
        }
        if (update) {
          graph = {
            serializedSurfaceMesh,
            serializedOcctShape,
          };
          graph.hash = computeHash(graph);
          // Not part of the hash.
          if (newMesh) {
            setCachedMesh(graph, newMesh);
          }
          if (newOcctShape) {
            occtShapeCache.set(graph, newOcctShape);
          }
        }
        results[nth] = {
          type: 'graph',
          matrix,
          tags,
          graph
        };
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        let polygonsWithHoles = {};
        g.GetPolygonsWithHoles(geometry, nth, polygonsWithHoles);
        const { tags = [] } = inputs[origin] || {};
        polygonsWithHoles.matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        polygonsWithHoles.tags = tags;
        results[nth] = polygonsWithHoles;
        break;
      }
      case GEOMETRY_SEGMENTS: {
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[origin] || {};
        const segments = [];
        results[nth] = {
          type: 'segments',
          segments,
          matrix,
          tags,
        };
        geometry.emitSegments(nth, (sX, sY, sZ, tX, tY, tZ, exact) => {
          segments.push([[sX, sY, sZ], [tX, tY, tZ], exact]);
        });
        break;
      }
      case GEOMETRY_POINTS: {
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[origin] || {};
        const points = [];
        const exactPoints = [];
        results[nth] = {
          type: 'points',
          points,
          exactPoints,
          matrix,
          tags,
        };
        geometry.emitPoints(nth, (x, y, z, exact) => {
          points.push([x, y, z]);
          exactPoints.push(exact);
        });
        break;
      }
      case GEOMETRY_EDGES: {
        // TODO: Figure out segments vs edges.
        const matrix = toJsTransformFromCgalTransform(geometry.getTransform(nth));
        const { tags = [] } = inputs[origin] || {};
        const segments = [];
        const normals = [];
        const faces = [];
        results[nth] = {
          type: 'segments',
          segments,
          matrix,
          tags,
          normals,
          faces,
        };
        geometry.emitEdges(nth, (sX, sY, sZ, tX, tY, tZ, nX, nY, nZ, face, exact) => {
          segments.push([[sX, sY, sZ], [tX, tY, tZ], exact]);
          normals.push([nX, nY, nZ]);
          faces.push(face);
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

export const withCgalGeometry = (name, inputs, op) => {
  const g = getCgal();
  const cgalGeometry = toCgalGeometry(inputs, g);
  try {
    return op(cgalGeometry, g);
  } catch (error) {
    console.log(`QQ/withCgalGeometry/error: ${name}`);
    console.log(error.stack);
    throw error;
  } finally {
    cgalGeometry.delete();
  }
};

export { getCgal };
