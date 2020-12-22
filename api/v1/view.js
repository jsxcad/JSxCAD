import { addPending, emit, getModule, write } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { nanoid } from 'nanoid/non-secure';
import { soup } from '@jsxcad/geometry-tagged';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  inline,
  op = (x) => x,
  {
    width = 1024,
    height = 512,
    position = [100, -100, 100],
    withAxes = false,
    withGrid = false,
  } = {}
) => {
  const viewShape = op(shape);
  for (const entry of ensurePages(soup(viewShape.toDisjointGeometry()))) {
    const path = `view/${getModule()}/${nanoid()}`;
    addPending(write(path, entry));
    const view = { width, height, position, inline, withAxes, withGrid };
    emit({ hash: nanoid(), path, view });
  }
  return shape;
};

Shape.prototype.view = function (
  inline,
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
  return view(this, inline, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.topView = function (
  inline,
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
  return view(this, inline, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.gridView = function (
  inline,
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
  return view(this, inline, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.frontView = function (
  inline,
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
  return view(this, inline, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape.prototype.sideView = function (
  inline,
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
  return view(this, inline, op, {
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};
