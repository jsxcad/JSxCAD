import { addPending, emit, getModule, write } from '@jsxcad/sys';

import { hash as hashGeometry, soup } from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { nanoid } from 'nanoid/non-secure';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  inline,
  op = (x) => x,
  { width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  const viewShape = op(shape);
  const hash = hashGeometry(viewShape.toGeometry());
  for (const entry of ensurePages(soup(viewShape.toDisjointGeometry()))) {
    const path = `view/${getModule()}/${nanoid()}`;
    addPending(write(path, entry));
    emit({ hash, path, view: { width, height, position, inline } });
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
