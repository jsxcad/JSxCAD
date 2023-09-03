import { fromPolygonSoup as fromPolygonSoupWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

export const fromPolygonSoup = (
  polygons,
  {
    tags = [],
    close = false,
    tolerance,
    wrapAlways,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    wrapRelativeAlpha,
    wrapRelativeOffset,
    cornerThreshold,
  } = {}
) => {
  const outputs = fromPolygonSoupWithCgal(
    polygons,
    tolerance,
    wrapAlways,
    wrapRelativeAlpha,
    wrapRelativeOffset,
    wrapAbsoluteAlpha,
    wrapAbsoluteOffset,
    cornerThreshold
  );
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};
