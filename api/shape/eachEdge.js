import { disorientSegment, eachFaceEdges } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

export const length = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

export const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

const SOURCE = 0;
const TARGET = 1;

// TODO: Fix up option destructuring to handle geometry, etc.
export const eachEdge = Shape.registerMethod2(
  'eachEdge',
  ['input', 'inputGeometry', 'function', 'function', 'function', 'options'],
  async (
    input,
    geometry,
    edgeOp = (e, _l, _o) => (_s) => e,
    faceOp = (es, _f) => (_s) => es,
    groupOp = Group,
    { select } = {}
  ) => {
    const faces = [];
    const faceEdges = [];
    const selections = [];
    if (select) {
      selections.push(await select.toGeometry());
    } else {
      selections.push(geometry);
    }
    eachFaceEdges(geometry, selections, (faceGeometry, edgeGeometry) => {
      faceEdges.push({ faceGeometry, edgeGeometry });
    });
    for (const { faceGeometry, edgeGeometry } of faceEdges) {
      const { matrix, segments, normals } = edgeGeometry;
      const edges = [];
      if (segments) {
        for (let nth = 0; nth < segments.length; nth++) {
          const segment = segments[nth];
          const [forward, backward] = disorientSegment(
            segment,
            matrix,
            normals ? normals[nth] : undefined
          );
          const edge = edgeOp(
            Shape.chain(Shape.fromGeometry(forward)),
            length(segment[SOURCE], segment[TARGET]),
            Shape.chain(Shape.fromGeometry(backward))
          )(input);
          edges.push(edge);
        }
      }
      faces.push(
        await faceOp(
          await Group(...edges),
          Shape.chain(Shape.fromGeometry(faceGeometry))
        )
      );
    }
    const grouped = groupOp(...faces);
    if (Shape.isFunction(grouped)) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
