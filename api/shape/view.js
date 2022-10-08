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

const applyModes = (shape, options, modes) => {
  if (modes.includes('wireframe')) {
    shape = shape.tag('show:wireframe');
  }
  if (modes.includes('noWireframe')) {
    shape = shape.tag('show:noWireframe');
  }
  if (modes.includes('skin')) {
    shape = shape.tag('show:skin');
  }
  if (modes.includes('noSkin')) {
    shape = shape.tag('show:noSkin');
  }
  if (modes.includes('Outline')) {
    shape = shape.tag('show:outline');
  }
  if (modes.includes('noOutline')) {
    shape = shape.tag('show:noOutline');
  }
  return shape;
};

// FIX: Avoid the extra read-write cycle.
export const baseView =
  (viewId = '', op = (x) => x, options = {}) =>
  (shape) => {
    let {
      size,
      inline,
      width = 512,
      height = 512,
      position = [100, -100, 100],
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
    for (const entry of ensurePages(viewShape.toDisplayGeometry())) {
      const geometry = tagGeometry(untagGeometry(entry, ['viewId:*']), [
        `viewId:${viewId}`,
      ]);
      const viewPath = `view/${path}/${id}/${viewId}.view`;
      addPending(write(viewPath, geometry));
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
      };
      emit({ hash: generateUniqueId(), path: viewPath, view });
    }
    return shape;
  };

export const topView = Shape.chainable((...args) => (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args, {
    object: {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 512,
      height: 512,
      position: [0, 0, 100],
    },
  });
  shape = applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

Shape.registerMethod('topView', topView);

export const gridView = Shape.chainable((...args) => (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args, {
    object: {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 512,
      height: 512,
      position: [0, 0, 100],
    },
  });
  shape = applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

Shape.registerMethod('gridView', gridView);

export const frontView = Shape.chainable((...args) => (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args, {
    object: {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 512,
      height: 512,
      position: [0, -100, 0],
    },
  });
  shape = applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

Shape.registerMethod('frontView', frontView);

export const sideView = Shape.chainable((...args) => (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args, {
    object: {
      size: 512,
      skin: true,
      outline: true,
      wireframe: false,
      width: 512,
      height: 512,
      position: [100, 0, 0],
    },
  });
  shape = applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

Shape.registerMethod('sideView', sideView);

export const view = Shape.chainable((...args) => (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args);
  shape = applyModes(shape, options, modes);
  if (modes.includes('grid')) {
    options.style = 'grid';
  }
  if (modes.includes('none')) {
    options.style = 'none';
  }
  if (modes.includes('side')) {
    options.style = 'side';
  }
  if (modes.includes('top')) {
    options.style = 'top';
  }
  switch (options.style) {
    case 'grid':
      return shape.gridView(viewId, op, options, ...modes);
    case 'none':
      return shape;
    case 'side':
      return shape.sideView(viewId, op, options, ...modes);
    case 'top':
      return shape.topView(viewId, op, options, ...modes);
    default:
      return baseView(viewId, op, options)(shape);
  }
});

Shape.registerMethod('view', view);
