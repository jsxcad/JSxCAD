import { addPending, emit, write } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  let nth = 0;
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    if (path) {
      const nthPath = `${path}_${nth++}`;
      addPending(write(nthPath, entry));
      emit({ view: { width, height, position, path: nthPath } });
    } else {
      emit({ view: { width, height, position, geometry: entry } });
    }
  }
  return shape;
};

Shape.prototype.view = function ({
  path,
  width = 1024,
  height = 512,
  position = [100, -100, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.topView = function ({
  path,
  width = 2014,
  height = 512,
  position = [0, 0, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.frontView = function ({
  path,
  width = 1024,
  height = 512,
  position = [0, -100, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.sideView = function ({
  path,
  width = 1024,
  height = 512,
  position = [100, 0, 0],
} = {}) {
  return view(this, { path, width, height, position });
};
