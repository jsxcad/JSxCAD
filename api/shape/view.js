import {
  emit,
  generateUniqueId,
  getSourceLocation,
  isNode,
  write,
} from '@jsxcad/sys';
// import { ensurePages, retag, toDisplayGeometry } from '@jsxcad/geometry';
import { retag, toDisplayGeometry } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { dataUrl } from '@jsxcad/ui-threejs';

const MODES =
  'modes:grid,none,side,top,wireframe,noWireframe,skin,noSkin,outline,noOutline';

const applyModes = (geometry, options, modes) => {
  const tags = [];
  if (modes.wireframe) {
    tags.push('show:wireframe');
  }
  if (modes.noWireframe) {
    tags.push('show:noWireframe');
  }
  if (modes.skin) {
    tags.push('show:skin');
  }
  if (modes.noSkin) {
    tags.push('show:noSkin');
  }
  if (modes.outline) {
    tags.push('show:outline');
  }
  if (modes.noOutline) {
    tags.push('show:noOutline');
  }
  return retag(geometry, [], tags);
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
export const baseViewOp = async (
  geometry,
  name,
  op = (_x) => (s) => s,
  {
    download,
    size = 256,
    inline,
    width,
    height,
    position = [100, -100, 100],
  } = {}
) => {
  if (size !== undefined) {
    width = size;
    height = size;
  }
  const viewGeometry = await Shape.applyToGeometry(geometry, op);
  const sourceLocation = getSourceLocation();
  if (!sourceLocation) {
    console.log('No sourceLocation');
  }
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  const displayGeometry = toDisplayGeometry(viewGeometry);
  // for (const pageGeometry of await ensurePages(displayGeometry)) {
  for (const pageGeometry of [displayGeometry]) {
    const viewPath = `view/${path}/${id}/${viewId}.view`;
    const hash = generateUniqueId();
    const thumbnailPath = `thumbnail/${path}/${id}/${viewId}.thumbnail`;
    const view = {
      name,
      viewId,
      width,
      height,
      position,
      inline,
      needsThumbnail: isNode,
      thumbnailPath,
      download,
    };
    emit({ hash, path: viewPath, view });
    await write(viewPath, pageGeometry);
    if (!isNode) {
      // FIX: dataUrl should operate on geometry.
      await write(
        thumbnailPath,
        dataUrl(Shape.fromGeometry(viewGeometry), view)
      );
    }
  }
  return geometry;
};

const topViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    size = 256,
    skin = true,
    outline = true,
    wireframe = true,
    width,
    height,
    position = [0, 0, 100],
  } = {},
  viewId
) => {
  const options = {
    download,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

export const topView = Shape.registerMethod3(
  'topView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  topViewOp
);

const gridViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [0, 0, 100],
  } = {},
  viewId
) => {
  const options = {
    download,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

export const gridView = Shape.registerMethod3(
  'gridView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  gridViewOp
);

const frontViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [0, -100, 0],
  } = {},
  viewId
) => {
  const options = {
    download,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

export const frontView = Shape.registerMethod3(
  'frontView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  frontViewOp
);

const sideViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [100, 0, 0],
  } = {},
  viewId
) => {
  const options = {
    download,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

export const sideView = Shape.registerMethod3(
  'sideView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  sideViewOp
);

export const view = Shape.registerMethod3(
  'view',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  (geometry, modes, op = (_x) => (s) => s, options, viewId) => {
    geometry = applyModes(geometry, options, modes);
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
        return gridViewOp(geometry, modes, op, options, viewId);
      case 'none':
        return geometry;
      case 'side':
        return sideViewOp(geometry, modes, op, options, viewId);
      case 'top':
        return topViewOp(geometry, modes, op, options, viewId);
      default:
        return baseViewOp(geometry, viewId, op, options);
    }
  }
);
