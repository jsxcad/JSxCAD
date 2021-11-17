import {
  addPending,
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import { Shape } from './Shape.js';
import { ensurePages } from './Page.js';

const byType = (args, defaultOptions) => {
  let viewId;
  let op = (x) => x;
  let options = defaultOptions;

  // An attempt to make view less annoying by assigning the arguments based on type.
  for (const arg of args) {
    if (arg instanceof Function) {
      op = arg;
    } else if (arg instanceof Object) {
      options = Object.assign({}, defaultOptions, arg);
    } else if (arg !== undefined) {
      viewId = arg;
    }
  }
  return { viewId, op, options };
};

// FIX: Avoid the extra read-write cycle.
export const baseView =
  (viewId, op = (x) => x, options = {}) =>
  (shape) => {
    let {
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
    } = options;

    if (size !== undefined) {
      width = size;
      height = size / 2;
    }
    const viewShape = op(shape);
    const sourceLocation = getSourceLocation();
    if (!sourceLocation) {
      console.log('No sourceLocation');
    }
    const { id, path } = sourceLocation;
    for (const entry of ensurePages(
      viewShape.toDisplayGeometry({ skin, outline, wireframe })
    )) {
      const viewPath = `view/${path}/${id}/${viewId}`;
      addPending(write(viewPath, entry));
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
        withAxes,
        withGrid,
      };
      emit({ hash: generateUniqueId(), path: viewPath, view });
    }
    return shape;
  };

export const topView =
  (...args) =>
  (shape) => {
    const { viewId, op, options } = byType(args, {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 1024,
      height: 512,
      position: [0, 0, 100],
    });
    return view(viewId, op, options)(shape);
  };

Shape.registerMethod('topView', topView);

export const gridView = (...args) => {
  const { viewId, op, options } = byType(args, {
    size: 512,
    skin: true,
    outline: true,
    wireframe: false,
    width: 1024,
    height: 512,
    position: [0, 0, 100],
    withGrid: true,
  });
  return (shape) => view(viewId, op, options)(shape);
};

Shape.registerMethod('gridView', gridView);

export const frontView =
  (...args) =>
  (shape) => {
    const { viewId, op, options } = byType(args, {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 1024,
      height: 512,
      position: [0, -100, 0],
    });
    return (shape) => view(viewId, op, options)(shape);
  };

Shape.registerMethod('frontView', frontView);

export const sideView =
  (...args) =>
  (shape) => {
    const { viewId, op, options } = byType(args, {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 1024,
      height: 512,
      position: [100, 0, 0],
    });
    return view(viewId, op, options)(shape);
  };

Shape.registerMethod('sideView');

export const view =
  (...args) =>
  (shape) => {
    const { viewId, op, options } = byType(args, {});
    switch (options.style) {
      case 'grid':
        return shape.gridView(viewId, op, options);
      case 'none':
        return shape;
      case 'side':
        return shape.sideView(viewId, op, options);
      case 'top':
        return shape.topView(viewId, op, options);
      default:
        return baseView(viewId, op, options)(shape);
    }
  };

Shape.registerMethod('view', view);
