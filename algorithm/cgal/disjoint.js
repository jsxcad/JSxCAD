import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const GEOMETRY_UNKNOWN = 0;
const GEOMETRY_MESH = 1;
const GEOMETRY_POLYGONS_WITH_HOLES = 2;
const GEOMETRY_SEGMENTS = 3;

export const disjoint = (inputs) => {
  try {
    const g = getCgal();
    let nth;
    let nthSegments;
    let cursor;
    const results = [];
    let polygonsWithHoles;
    let output;
    let points;
    let exactPoints;
    const getType = (index) => {
      nth = index;
      cursor = undefined;
      switch (inputs[nth].type) {
        case 'graph':
          return GEOMETRY_MESH;
        case 'polygonsWithHoles':
          return GEOMETRY_POLYGONS_WITH_HOLES;
        case 'segments':
          return GEOMETRY_SEGMENTS;
        default:
          return GEOMETRY_UNKNOWN;
      }
    };
    const getTransform = () =>
      toCgalTransformFromJsTransform(inputs[nth].matrix);
    const getIsMasked = () =>
      inputs[nth].tags && inputs[nth].tags.includes('type:masked');
    const getMesh = () => toSurfaceMesh(inputs[nth].graph);
    const fillPolygonsWithHolesPlane = (planeToFill) => {
      if (inputs[nth].exactPlane) {
        const [a, b, c, d] = inputs[nth].exactPlane;
        g.fillExactQuadruple(planeToFill, a, b, c, d);
      } else {
        const [x, y, z, w] = inputs[nth].plane;
        g.fillQuadruple(planeToFill, x, y, z, -w);
      }
    };
    const fillPolygonsWithHolesBoundary = (boundaryToFill) => {
      if (cursor === undefined) {
        cursor = 0;
      } else {
        cursor += 1;
      }
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
    };
    const fillPolygonsWithHolesHole = (holeToFill, nthHole) => {
      const polygon = inputs[nth].polygonsWithHoles[cursor];
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
    };
    const outputMesh = (nth, mesh) => {
      mesh.provenance = 'disjoint';
      const { matrix, tags } = inputs[nth];
      // Note: The 0th mesh is not emitted as it does not get cut.
      results[nth] = {
        type: 'graph',
        matrix,
        tags,
        graph: fromSurfaceMesh(mesh),
      };
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
    const outputPolygonPoint = (x, y, z, exactX, exactY, exactZ) => {
      points.push([x, y, z]);
      exactPoints.push([exactX, exactY, exactZ]);
    };
    const outputPolygonsWithHoles = (nth) => {
      const { matrix, tags, plane = [0, 0, 1, 0] } = inputs[nth];
      polygonsWithHoles = [];
      results[nth] = {
        type: 'polygonsWithHoles',
        polygonsWithHoles,
        plane,
        matrix,
        tags,
      };
    };
    const processSegments = (nth, segmentProcessor) => {
      nthSegments = nth;
      const { type, segments, tags, matrix } = inputs[nth];
      results[nthSegments] = { type, tags, matrix, segments: [] };
      for (const [source, target] of segments) {
        const [sourceX, sourceY, sourceZ] = source;
        const [targetX, targetY, targetZ] = target;
        segmentProcessor.cut(
          sourceX,
          sourceY,
          sourceZ,
          targetX,
          targetY,
          targetZ
        );
      }
    };
    const outputSegment = (
      sourceX,
      sourceY,
      sourceZ,
      targetX,
      targetY,
      targetZ
    ) => {
      const source = [sourceX, sourceY, sourceZ];
      const target = [targetX, targetY, targetZ];
      results[nthSegments].segments.push([source, target]);
    };
    const status = g.DisjointIncrementally(
      inputs.length,
      getType,
      getTransform,
      getIsMasked,
      getMesh,
      fillPolygonsWithHolesPlane,
      fillPolygonsWithHolesBoundary,
      fillPolygonsWithHolesHole,
      outputMesh,
      outputPolygon,
      outputPolygonPoint,
      outputPolygonsWithHoles,
      processSegments,
      outputSegment
    );
    if (status === STATUS_ZERO_THICKNESS) {
      throw new ErrorZeroThickness('Zero thickness produced by disjoint');
    }
    if (status !== STATUS_OK) {
      throw new Error(`Unexpected status ${status}`);
    }
    for (let nth = 0; nth < inputs.length; nth++) {
      if (results[nth] === undefined) {
        const { tags, matrix } = inputs[nth];
        results[nth] = { type: 'group', tags, matrix, contents: [] };
      }
    }
    return results;
  } catch (error) {
    console.log(error.stack);
    throw Error(error);
  }
};
