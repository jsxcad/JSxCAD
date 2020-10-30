import { addPending, emit, write } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import hashSum from 'hash-sum';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  inline,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  let nth = 0;
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    const entryHash = hashSum(entry);
    if (path) {
      const nthPath = `${path}_${nth++}`;
      addPending(write(nthPath, entry));
      const view = {
        width,
        height,
        position,
        path: nthPath,
        inline,
        entryHash,
      };
      const hash = hashSum(view);
      emit({ view, hash });
    } else {
      const view = {
        width,
        height,
        position,
        geometry: entry,
        inline,
        entryHash,
      };
      const hash = hashSum(view);
      emit({ view, hash });
    }
  }
  return shape;
};

Shape.prototype.view = function (
  inline,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) {
  return view(this, inline, { path, width, height, position });
};

Shape.prototype.topView = function (
  inline,
  { path, width = 1024, height = 512, position = [0, 0, 100] } = {}
) {
  return view(this, inline, { path, width, height, position });
};

Shape.prototype.frontView = function (
  inline,
  { path, width = 1024, height = 512, position = [0, -100, 0] } = {}
) {
  return view(this, inline, { path, width, height, position });
};

Shape.prototype.sideView = function (
  inline,
  { path, width = 1024, height = 512, position = [100, 0, 0] } = {}
) {
  return view(this, inline, { path, width, height, position });
};
