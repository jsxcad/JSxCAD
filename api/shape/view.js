import {
  addPending,
  emit,
  generateUniqueId,
  getSourceLocation,
  write,
} from '@jsxcad/sys';

import Shape from './Shape.js';
import { ensurePages } from './Page.js';
import { tagGeometry } from './tag.js';
import { untagGeometry } from './untag.js';

const markContent = (geometry) => {
  if (geometry.type === 'group') {
    return {
      ...geometry,
      content: geometry.content.map((child, nth) =>
        tagGeometry(untagGeometry(child, ['groupChildId:*']), [
          `groupChildId:${nth}`,
        ])
      ),
    };
  } else {
    return geometry;
  }
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
      withGrid = true,
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
      markContent(viewShape.toDisplayGeometry({ skin, outline, wireframe }))
    )) {
      const geometry = tagGeometry(untagGeometry(entry, ['viewId:*']), [
        `viewId:${viewId}`,
      ]);
      const viewPath = `view/${path}/${id}/${viewId}`;
      addPending(write(viewPath, geometry));
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
    const {
      value: viewId,
      func: op = (x) => x,
      object: options,
    } = Shape.destructure(args, {
      object: {
        size: 512,
        skin: true,
        outline: true,
        wireframe: false,
        width: 1024,
        height: 512,
        position: [0, 0, 100],
      },
    });
    return view(viewId, op, options)(shape);
  };

Shape.registerMethod('topView', topView);

export const gridView = (...args) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
  } = Shape.destructure(args, {
    object: {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 1024,
      height: 512,
      position: [0, 0, 100],
      withGrid: true,
    },
  });
  return (shape) => view(viewId, op, options)(shape);
};

Shape.registerMethod('gridView', gridView);

export const frontView =
  (...args) =>
  (shape) => {
    const {
      value: viewId,
      func: op = (x) => x,
      object: options,
    } = Shape.destructure(args, {
      object: {
        size: 512,
        skin: true,
        outline: true,
        wireframe: false,
        width: 1024,
        height: 512,
        position: [0, -100, 0],
      },
    });
    return (shape) => view(viewId, op, options)(shape);
  };

Shape.registerMethod('frontView', frontView);

export const sideView =
  (...args) =>
  (shape) => {
    const {
      value: viewId,
      func: op = (x) => x,
      object: options,
    } = Shape.destructure(args, {
      object: {
        size: 512,
        skin: true,
        outline: true,
        wireframe: false,
        width: 1024,
        height: 512,
        position: [100, 0, 0],
      },
    });
    return view(viewId, op, options)(shape);
  };

Shape.registerMethod('sideView');

export const view =
  (...args) =>
  (shape) => {
    const {
      value: viewId,
      func: op = (x) => x,
      object: options,
    } = Shape.destructure(args);
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
