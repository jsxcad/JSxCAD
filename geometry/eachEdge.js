import { disorientSegment } from './disorientSegment.js';
import { distance } from './vector.js';
import { toFaceEdgesList } from './eachFaceEdges.js';

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

const SOURCE = 0;
const TARGET = 1;

// TODO: Fix up option destructuring to handle geometry, etc.
export const toOrientedFaceEdgesList = (
  geometry,
  _edgeOp,
  _faceOp,
  _groupOp,
  { select = [geometry] } = {}
) => {
  const faces = [];
  const faceEdgesList = toFaceEdgesList(geometry, { select });
  for (const { face, edges } of faceEdgesList) {
    const edgeResults = [];
    const { matrix, segments, normals } = edges;
    if (segments) {
      for (let nth = 0; nth < segments.length; nth++) {
        const baseSegment = segments[nth];
        const [forward, backward] = disorientSegment(
          baseSegment,
          matrix,
          normals ? normals[nth] : undefined
        );
        edgeResults.push({
          segment: forward,
          length: distance(baseSegment[SOURCE], baseSegment[TARGET]),
          backward,
        });
      }
    }
    faces.push({ face, edges: edgeResults });
  }
  return faces;
};
