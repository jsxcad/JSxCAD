import {
  computeToolpath as computeToolpathWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const computeToolpath = (
  geometry,
  material,
  selection,
  toolSpacing,
  toolSize,
  toolCutDepth
) => {
  const inputs = [];
  linearize(geometry, filter, inputs);
  const materialStart = inputs.length;
  linearize(material, filter, inputs);
  const selectionStart = inputs.length;
  linearize(selection, filter, inputs);
  const outputs = computeToolpathWithCgal(
    inputs,
    materialStart,
    selectionStart,
    inputs.length,
    toolSpacing,
    toolSize,
    toolCutDepth
  );
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};
