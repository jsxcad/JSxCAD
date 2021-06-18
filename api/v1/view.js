import {
  addPending,
  emit,
  generateUniqueId,
  getModule,
  write,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-shapes';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  { size, triangles = true, outline = true, wireframe = false },
  op = (x) => x,
  {
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
  const viewShape = op(shape);
  for (const entry of ensurePages(
    viewShape.toDisplayGeometry({ triangles, outline, wireframe })
  )) {
    const path = `view/${getModule()}/${generateUniqueId()}`;
    addPending(write(path, entry));
    const view = { width, height, position, inline, withAxes, withGrid };
    emit({ hash: generateUniqueId(), path, view });
  }
  return shape;
};

Shape.prototype.view = function (
  { size = 512, triangles = true, outline = true, wireframe = false } = {},
  op,
  {
    path,
    width = 1024,
    height = 512,
    position = [100, -100, 100],
    withAxes,
    withGrid,
  } = {}
) {
  return view(this, { size, triangles, outline, wireframe }, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.topView = function (
  { size = 512, triangles = true, outline = true, wireframe = false } = {},
  op,
  {
    path,
    width = 1024,
    height = 512,
    position = [0, 0, 100],
    withAxes,
    withGrid,
  } = {}
) {
  return view(this, { size, triangles, outline, wireframe }, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.gridView = function (
  { size = 512, triangles = true, outline = true, wireframe = false } = {},
  op,
  {
    path,
    width = 1024,
    height = 512,
    position = [0, 0, 100],
    withAxes,
    withGrid = true,
  } = {}
) {
  return view(this, { size, triangles, outline, wireframe }, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.frontView = function (
  { size = 512, triangles = true, outline = true, wireframe = false } = {},
  op,
  {
    path,
    width = 1024,
    height = 512,
    position = [0, -100, 0],
    withAxes,
    withGrid,
  } = {}
) {
  return view(this, { size, triangles, outline, wireframe }, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.sideView = function (
  { size = 512, triangles = true, outline = true, wireframe = false } = {},
  op,
  {
    path,
    width = 1024,
    height = 512,
    position = [100, 0, 0],
    withAxes,
    withGrid,
  } = {}
) {
  return view(this, { size, triangles, outline, wireframe }, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};
