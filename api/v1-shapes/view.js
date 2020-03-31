import Shape from '@jsxcad/api-v1-shape';
import { emit } from '@jsxcad/sys';
import { ensurePages } from '@jsxcad/api-v1-plans';
import { getLeafs } from '@jsxcad/geometry-tagged';

// FIX: We shouldn't need to supply a path to this.
const view = (shape, { width = 1024, height = 512, position = [100, -100, 100] } = {}) => {
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      emit({ geometry: { width, height, position, geometry: leaf } });
    }
  }
  return shape;
};

Shape.prototype.view = function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallView = function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigView = function ({ width = 1024, height = 512, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.topView = function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallTopView = function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigTopView = function ({ width = 1024, height = 512, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.frontView = function ({ width = 512, height = 256, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallFrontView = function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigFrontView = function ({ width = 1024, height = 512, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
};
