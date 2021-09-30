import {
  addPending,
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { Shape } from './Shape.js';
import { ensurePages } from './Page.js';

// FIX: Avoid the extra read-write cycle.
export const baseView =
  (
    op = (x) => x,
    {
      size,
      skin = true,
      outline = true,
      wireframe = false,
      inline,
      width = 512,
      height = 256,
      position = [100, -100, 100],
      withAxes = false,
      withGrid = false,
    } = {}
  ) =>
  (shape) => {
    if (size !== undefined) {
      width = size;
      height = size / 2;
    }
    const viewShape = op(shape);
    const sourceLocation = getSourceLocation();
    if (!sourceLocation) {
      console.log('No sourceLocation');
    }
    const { path } = sourceLocation;
    for (const entry of ensurePages(
      viewShape.toDisplayGeometry({ skin, outline, wireframe })
    )) {
      const viewPath = `view/${path}/${generateUniqueId()}`;
      addPending(write(viewPath, entry));
      const view = { width, height, position, inline, withAxes, withGrid };
      emit({ hash: generateUniqueId(), path: viewPath, view });
    }
    return shape;
  };

export const topView =
  (
    op,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      path,
      width = 1024,
      height = 512,
      position = [0, 0, 100],
      withAxes,
      withGrid,
    } = {}
  ) =>
  (shape) =>
    view(op, {
      size,
      skin,
      outline,
      wireframe,
      path,
      width,
      height,
      position,
      withAxes,
      withGrid,
    })(shape);

Shape.registerMethod('topView', topView);

export const gridView =
  (
    op,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      path,
      width = 1024,
      height = 512,
      position = [0, 0, 100],
      withAxes,
      withGrid = true,
    } = {}
  ) =>
  (shape) =>
    view(op, {
      size,
      skin,
      outline,
      wireframe,
      path,
      width,
      height,
      position,
      withAxes,
      withGrid,
    })(shape);

Shape.registerMethod('gridView', gridView);

export const frontView =
  (
    op,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      path,
      width = 1024,
      height = 512,
      position = [0, -100, 0],
      withAxes,
      withGrid,
    } = {}
  ) =>
  (shape) =>
    view(op, {
      size,
      skin,
      outline,
      wireframe,
      path,
      width,
      height,
      position,
      withAxes,
      withGrid,
    })(shape);

Shape.registerMethod('frontView', frontView);

export const sideView =
  ({
    size = 512,
    skin = true,
    outline = true,
    wireframe = false,
    op,
    path,
    width = 1024,
    height = 512,
    position = [100, 0, 0],
    withAxes,
    withGrid,
  } = {}) =>
  (shape) =>
    view(op, {
      size,
      skin,
      outline,
      wireframe,
      path,
      width,
      height,
      position,
      withAxes,
      withGrid,
    })(shape);

Shape.registerMethod('sideView');

export const view =
  (op, options = {}) =>
  (shape) => {
    switch (options.style) {
      case 'grid':
        return shape.gridView(op, options);
      case 'none':
        return shape;
      case 'side':
        return shape.sideView(op, options);
      case 'top':
        return shape.topView(op, options);
      default:
        return baseView(op, options)(shape);
    }
  };

Shape.registerMethod('view', view);
