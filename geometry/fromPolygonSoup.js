import { fromPolygonSoup as fromPolygonSoupWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

export const fromPolygonSoup = (
  polygons,
  {
    tags = [],
    close = false,
    tolerance,
    faceCountLimit,
    minErrorDrop,
    strategies = [],
  } = {}
) => {
  const outputs = fromPolygonSoupWithCgal(
    polygons,
    tolerance,
    faceCountLimit,
    minErrorDrop,
    strategies
  );
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};
