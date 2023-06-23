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

const MODES =
  'modes:grid,none,side,top,wireframe,noWireframe,skin,noSkin,outline,noOutline';

const applyModes = async (shape, options, modes) => {
  if (modes.wireframe) {
    shape = await shape.tag('show:wireframe');
  }
  if (modes.noWireframe) {
    shape = await shape.tag('show:noWireframe');
  }
  if (modes.skin) {
    shape = await shape.tag('show:skin');
  }
  if (modes.noSkin) {
    shape = await shape.tag('show:noSkin');
  }
  if (modes.outline) {
    shape = await shape.tag('show:outline');
  }
  if (modes.noOutline) {
    shape = await shape.tag('show:noOutline');
  }
  return shape;
};

export const qualifyViewId = (viewId, { id, path, nth }) => {
  if (viewId) {
    // We can't put spaces into viewId since that would break dom classname requirements.
    viewId = `${id}_${String(viewId).replace(/ /g, '_')}`;
  } else if (nth) {
    viewId = `${id}_${nth}`;
  } else {
    viewId = `${id}`;
  }
  return { id, path, viewId };
};

// FIX: Avoid the extra read-write cycle.
export const baseView =
  (
    name,
    op = (x) => x,
    { size = 512, inline, width, height, position = [100, -100, 100] } = {}
  ) =>
  async (shape) => {
    if (size !== undefined) {
      width = size;
      height = size;
    }
    const viewShape = await op(shape);
    const sourceLocation = getSourceLocation();
    if (!sourceLocation) {
      console.log('No sourceLocation');
    }
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    const displayGeometry = await viewShape.toDisplayGeometry();
    for (const pageGeometry of await ensurePages(
      Shape.fromGeometry(displayGeometry),
      0,
      viewId
    )) {
      const viewPath = `view/${path}/${id}/${viewId}.view`;
      const hash = generateUniqueId();
      const thumbnailPath = `thumbnail/${path}/${id}/${viewId}.thumbnail`;
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
        needsThumbnail: isNode,
        thumbnailPath,
      };
      emit({ hash, path: viewPath, view });
      await write(viewPath, pageGeometry);
      if (!isNode) {
        await write(thumbnailPath, dataUrl(viewShape, view));
      }
    }
    return shape;
  };

export const topView = Shape.registerMethod2(
  'topView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = true,
      width,
      height,
      position = [0, 0, 100],
    } = {},
    viewId
  ) => {
    const options = { size, skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

export const gridView = Shape.registerMethod2(
  'gridView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [0, 0, 100],
    } = {},
    viewId
  ) => {
    const options = { skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

export const frontView = Shape.registerMethod2(
  'frontView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [0, -100, 0],
    } = {},
    viewId
  ) => {
    const options = { skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

export const sideView = Shape.registerMethod2(
  'sideView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [100, 0, 0],
    } = {},
    viewId
  ) => {
    const options = { skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

export const view = Shape.registerMethod2(
  'view',
  ['input', MODES, 'function', 'options', 'value'],
  async (input, modes, op = (x) => x, options, viewId) => {
    const shape = await applyModes(input, options, modes);
    if (modes.grid) {
      options.style = 'grid';
    }
    if (modes.none) {
      options.style = 'none';
    }
    if (modes.side) {
      options.style = 'side';
    }
    if (modes.top) {
      options.style = 'top';
    }
    switch (options.style) {
      case 'grid':
        return shape.gridView(viewId, op, options, modes);
      case 'none':
        return shape;
      case 'side':
        return shape.sideView(viewId, op, options, modes);
      case 'top':
        return shape.topView(viewId, op, options, modes);
      default:
        return baseView(viewId, op, options)(shape);
    }
  }
);
