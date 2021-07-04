import { Shape, ensurePages } from '@jsxcad/api-v2';
import {
  addPending,
  emit,
  generateUniqueId,
  getModule,
  write,
} from '@jsxcad/sys';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  {
    size,
    skin = true,
    outline = true,
    wireframe = false,
    prepareView = (x) => x,
    inline,
    width = 1024,
    height = 512,
    position = [100, -100, 100],
    withAxes = false,
    withGrid = false,
  } = {}
) => {
  if (size !== undefined) {
    width = size;
    height = size / 2;
  }
  const viewShape = prepareView(shape);
  for (const entry of ensurePages(
    viewShape.toDisplayGeometry({ skin, outline, wireframe })
  )) {
    const path = `view/${getModule()}/${generateUniqueId()}`;
    addPending(write(path, entry));
    const view = { width, height, position, inline, withAxes, withGrid };
    emit({ hash: generateUniqueId(), path, view });
  }
  return shape;
};

Shape.prototype.view = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [100, -100, 100],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.topView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, 0, 100],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.gridView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, 0, 100],
  withAxes,
  withGrid = true,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.frontView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, -100, 0],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.sideView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [100, 0, 0],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};
