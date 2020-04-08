import { addPending, emit, write } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-plans';

// FIX: Avoid the extra read-write cycle.
const view = (shape, { path, width = 1024, height = 512, position = [100, -100, 100] } = {}) => {
  let nth = 0;
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    if (path) {
      const nthPath = `${path}_${nth++}`;
      addPending(write(nthPath, entry));
      emit({ geometry: { width, height, position, path: nthPath } });
    } else {
      emit({ geometry: { width, height, position, geometry: entry } });
    }
  }
  return shape;
};

Shape.prototype.view = function ({ path, width = 512, height = 256, position = [100, -100, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallView = function ({ path, width = 256, height = 128, position = [100, -100, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigView = function ({ path, width = 1024, height = 512, position = [100, -100, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.topView = function ({ path, width = 512, height = 256, position = [0, 0, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallTopView = function ({ path, width = 256, height = 128, position = [0, 0, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigTopView = function ({ path, width = 1024, height = 512, position = [0, 0, 100] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.frontView = function ({ path, width = 512, height = 256, position = [0, -100, 0] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallFrontView = function ({ path, width = 256, height = 128, position = [0, -100, 0] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigFrontView = function ({ path, width = 1024, height = 512, position = [0, -100, 0] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.sideView = function ({ path, width = 512, height = 256, position = [100, 0, 0] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallSideView = function ({ path, width = 256, height = 128, position = [100, 0, 0] } = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigSideView = function ({ path, width = 1024, height = 512, position = [100, 0, 0] } = {}) {
  return view(this, { path, width, height, position });
};
