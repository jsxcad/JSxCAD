import Group from './Group.js';
import Shape from './Shape.js';
import { toOrientedFaceEdgesList as op } from '@jsxcad/geometry';

export const edges = Shape.registerMethod3(
  'edges',
  ['inputGeometry', 'function', 'function'],
  op,
  async (
    faceEdgesList,
    [geometry, edgesOp = (edges) => (_shape) => edges, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const { edges } of faceEdgesList) {
      shapes.push(
        await Shape.apply(
          input,
          edgesOp,
          ...edges.map(({ segment }) => Shape.fromGeometry(segment))
        )
      );
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);

export default edges;
