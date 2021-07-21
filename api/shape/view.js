import {
  addPending,
  emit,
  generateUniqueId,
  getModule,
  write,
} from '@jsxcad/sys';

import { Shape } from './Shape.js';
import { ensurePages } from './Page.js';

// FIX: Avoid the extra read-write cycle.
export const baseView =
  ({
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
  } = {}) =>
  (shape) => {
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

export const topView =
  ({
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
  } = {}) =>
  (shape) =>
    view({
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
    })(shape);

Shape.registerMethod('topView', topView);

export const gridView =
  ({
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
  } = {}) =>
  (shape) =>
    view({
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
    })(shape);

Shape.registerMethod('gridView', gridView);

export const frontView =
  ({
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
  } = {}) =>
  (shape) =>
    view({
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
    })(shape);

Shape.registerMethod('frontView', frontView);

export const sideView =
  ({
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
  } = {}) =>
  (shape) =>
    view({
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
    })(shape);

Shape.registerMethod('sideView');

export const view =
  (options = {}) =>
  (shape) => {
    switch (options.style) {
      case 'grid':
        return shape.gridView(options);
      case 'none':
        return shape;
      case 'side':
        return shape.sideView(options);
      case 'top':
        return shape.topView(options);
      default:
        return baseView(options)(shape);
    }
  };

Shape.registerMethod('view', view);
