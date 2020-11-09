import { addPending, emit, write } from '@jsxcad/sys';

import {
  hash as hashGeometry,
  realize as realizeGeometry,
  soup,
} from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  inline,
  op = (x) => x,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  const viewShape = op(shape);
  let nth = 0;
  const hash = hashGeometry(viewShape.toGeometry());
  for (const entry of ensurePages(soup(viewShape.toDisjointGeometry()))) {
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
  op,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) {
  return view(this, inline, op, { path, width, height, position });
};

Shape.prototype.topView = function (
  inline,
  op,
  { path, width = 1024, height = 512, position = [0, 0, 100] } = {}
) {
  return view(this, inline, op, { path, width, height, position });
};

Shape.prototype.frontView = function (
  inline,
  op,
  { path, width = 1024, height = 512, position = [0, -100, 0] } = {}
) {
  return view(this, inline, op, { path, width, height, position });
};

Shape.prototype.sideView = function (
  inline,
  op,
  { path, width = 1024, height = 512, position = [100, 0, 0] } = {}
) {
  return view(this, inline, op, { path, width, height, position });
};
