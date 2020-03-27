import Shape from './Shape';
import { emit } from '@jsxcad/sys';

// FIX: We shouldn't need to supply a path to this.
const view = (shape, { width = 1024, height = 512, position = [100, -100, 100] } = {}) => {
  const geometry = shape.toKeptGeometry();
  emit({ geometry: { width, height, position, geometry } });
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
