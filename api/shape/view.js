import {
  emit,
  generateUniqueId,
  getSourceLocation,
  isNode,
  write,
} from '@jsxcad/sys';

import Shape from './Shape.js';
import { dataUrl } from '@jsxcad/ui-threejs';
import { ensurePages } from './Page.js';

const applyModes = async (shape, options, modes) => {
  if (modes.includes('wireframe')) {
    shape = await shape.tag('show:wireframe');
  }
  if (modes.includes('noWireframe')) {
    shape = await shape.tag('show:noWireframe');
  }
  if (modes.includes('skin')) {
    shape = await shape.tag('show:skin');
  }
  if (modes.includes('noSkin')) {
    console.log(shape);
    shape = await shape.tag('show:noSkin');
  }
  if (modes.includes('Outline')) {
    shape = await shape.tag('show:outline');
  }
  if (modes.includes('noOutline')) {
    shape = await shape.tag('show:noOutline');
  }
  return shape;
};

// FIX: Avoid the extra read-write cycle.
export const baseView =
  (viewId, op = (x) => x, options = {}) =>
  async (shape) => {
    console.log(`QQ/baseView`);
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
    const viewShape = await op(shape);
    const sourceLocation = getSourceLocation();
    if (!sourceLocation) {
      console.log('No sourceLocation');
    }
    const { id, path, nth } = sourceLocation;
    if (viewId === undefined) {
      viewId = nth;
    }
    const displayGeometry = await viewShape.toDisplayGeometry();
    console.log(
      `QQ/baseView/displayGeometry: ${JSON.stringify(displayGeometry)}`
    );
    const pages = await ensurePages(Shape.fromGeometry(displayGeometry));
    console.log(`QQ/baseView/pages: ${JSON.stringify(pages)}`);
    for (const entry of pages) {
      const geometry = await entry;
      const viewPath = `view/${path}/${id}/${viewId}.view`;
      const hash = generateUniqueId();
      const thumbnailPath = `thumbnail/${hash}`;
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
        needsThumbnail: isNode,
      };
      emit({ hash, path: viewPath, view });
      console.log(`QQ/baseView/write: ${viewPath}`);
      console.log(`QQ/baseView/geometry: ${geometry}`);
      console.log(`QQ/baseView/geometry.isChain: ${geometry.isChain}`);
      await write(viewPath, displayGeometry);
      if (!isNode) {
        await write(thumbnailPath, dataUrl(viewShape, view));
      }
    }
    return shape;
  };

export const topView = Shape.registerMethod('topView', (...args) => async (shape) => {
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
  shape = await applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

export const gridView = Shape.registerMethod(
  'gridView',
  (...args) =>
    async (shape) => {
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
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

export const frontView = Shape.registerMethod(
  'frontView',
  (...args) =>
    async (shape) => {
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
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

export const sideView = Shape.registerMethod(
  'sideView',
  (...args) =>
    async (shape) => {
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
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

export const view = Shape.registerMethod('view', (...args) => async (shape) => {
  console.log(`QQ/view: ${JSON.stringify(shape)}`);
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args);
  console.log(`QQ/view/shape: ${JSON.stringify(shape)}`);
  shape = await applyModes(shape, options, modes);
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
