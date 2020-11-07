import { addPending, emit, write } from '@jsxcad/sys';

import {
  hash as hashGeometry,
  realize as realizeGeometry,
} from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  inline,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  let nth = 0;
  const hash = hashGeometry(shape.toGeometry());
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    if (path) {
      const nthPath = `${path}_${nth++}`;
      addPending(write(nthPath, entry));
      const view = {
        width,
        height,
        position,
        path: nthPath,
        inline,
      };
      emit({ view, hash: `${hash}_${nth}` });
    } else {
      const view = {
        width,
        height,
        position,
        geometry: realizeGeometry(entry),
        inline,
      };
      emit({ view, hash: `${hash}_${nth}` });
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
