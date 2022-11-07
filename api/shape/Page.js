import { List, list } from './List.js';

import {
  getLayouts,
  getLeafs,
  measureBoundingBox,
  taggedGroup,
  taggedLayout,
  toConcreteGeometry,
} from '@jsxcad/geometry';

import Box from './Box.js';
import Group from './Group.js';
import Hershey from './Hershey.js';
import Shape from './Shape.js';
import { align } from './align.js';
import { destructure } from './destructure.js';

const MIN = 0;
const MAX = 1;
const X = 0;
const Y = 1;

const buildLayoutGeometry = async ({
  layer,
  pageWidth,
  pageLength,
  margin,
  center = false,
}) => {
  console.log(`QQ/buildLayoutGeometry: ${JSON.stringify(layer)}`);
  const itemNames = (await layer
    .getNot('type:ghost')
    .tags('item', list))
    .filter((name) => name !== '')
    .flatMap((name) => name)
    .sort();
  const labelScale = 0.0125 * 10;
  const size = [pageWidth, pageLength];
  const r = (v) => Math.floor(v * 100) / 100;
  const fontHeight = Math.max(pageWidth, pageLength) * labelScale;
  const title = [];
  if (isFinite(pageWidth) && isFinite(pageLength)) {
    // CHECK: Even when this is only called once we're getting a duplication of the
    // 'x' at the start. If we replace it with 'abc', we get the 'b' at the start.
    const text = `${r(pageWidth)} x ${r(pageLength)}`;
    title.push(await Hershey(text, fontHeight));
  }
  for (let nth = 0; nth < itemNames.length; nth++) {
    title.push(await Hershey(itemNames[nth], fontHeight).y((nth + 1) * fontHeight));
  }
  const visualization = Box(
    Math.max(pageWidth, margin),
    Math.max(pageLength, margin)
  )
    .outline()
    .and(
      Group(...title).move(pageWidth / -2, (pageLength * (1 + labelScale)) / 2)
    )
    .color('red')
    .ghost();
  console.log(`QQ/buildLayoutGeometry/layer.toGeometry(): ${JSON.stringify(layer.toGeometry())}`);
  let layout = Shape.fromGeometry(
    taggedLayout(
      { size, margin, title },
      (await layer).toGeometry(),
      (await visualization).toGeometry()
    )
  );
  if (center) {
    layout = layout.by(align());
  }
  return layout;
};

export const Page = Shape.registerShapeMethod('Page', async (...args) => {
  const {
    object: options,
    strings: modes,
    shapesAndFunctions: shapes,
  } = destructure(args);
  let {
    size,
    pageMargin = 5,
    itemMargin = 1,
    itemsPerPage = Infinity,
  } = options;
  let pack = modes.includes('pack');
  const center = modes.includes('center');

  if (modes.includes('a4')) {
    size = [210, 297];
  }

  if (modes.includes('individual')) {
    pack = true;
    itemsPerPage = 1;
  }

  const margin = itemMargin;
  const layers = [];
  console.log(`QQ/shapes.length: ${shapes.length}`);
  console.log(`QQ/shapes.then: ${shapes.then}`);
  for (const shape of shapes) {
    for (const leaf of getLeafs(shape.toConcreteGeometry())) {
      layers.push(leaf);
    }
  }
  console.log(`QQ/layers.length: ${layers.length}`);
  if (!pack && size) {
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    const [width, height] = size;
    const packSize = [
      [-width / 2, -height / 2, 0],
      [width / 2, height / 2, 0],
    ];
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X] * 2),
        Math.abs(packSize[MIN][X] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y] * 2),
        Math.abs(packSize[MIN][Y] * 2)
      ) +
      pageMargin * 2;
    return buildLayoutGeometry({
      layer,
      pageWidth,
      pageLength,
      margin,
      center,
    });
  } else if (!pack && !size) {
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    const packSize = measureBoundingBox(layer.toGeometry());
    if (packSize === undefined) {
      return Group();
    }
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X] * 2),
        Math.abs(packSize[MIN][X] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y] * 2),
        Math.abs(packSize[MIN][Y] * 2)
      ) +
      pageMargin * 2;
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      return buildLayoutGeometry({
        layer,
        pageWidth,
        pageLength,
        margin,
        center,
      });
    } else {
      return buildLayoutGeometry({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  } else if (pack && size) {
    // Content fits to page size.
    const packSize = [];
    const content = Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
      size,
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    const pageWidth = Math.max(1, packSize[MAX][X] - packSize[MIN][X]);
    const pageLength = Math.max(1, packSize[MAX][Y] - packSize[MIN][Y]);
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of content.get('pack:layout', List)) {
        plans.push(
          await buildLayoutGeometry({
            layer,
            pageWidth,
            pageLength,
            margin,
            center,
          })
        );
      }
      return Group(...plans);
    } else {
      const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
      return buildLayoutGeometry({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  } else if (pack && !size) {
    const packSize = [];
    // Page fits to content size.
    const contents = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      console.log(`QQ/layers.length/2: ${layers.length}`);
      throw Error('Packing failed');
    }
    // FIX: Using content.size() loses the margin, which is a problem for repacking.
    // Probably page plans should be generated by pack and count toward the size.
    const pageWidth = packSize[MAX][X] - packSize[MIN][X];
    const pageLength = packSize[MAX][Y] - packSize[MIN][Y];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      console.log(`QQ/contents: ${contents}`);
      for (const layer of contents.get('pack:layout', List)) {
        const layout = await buildLayoutGeometry({
          layer,
          packSize,
          pageWidth,
          pageLength,
          margin,
          center,
        });
        plans.push(layout);
      }
      return Group(...plans);
    } else {
      const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
      return buildLayoutGeometry({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  }
});

export const page = Shape.registerMethod('page',
  (...args) =>
  (shape) =>
    Page(shape, ...args));

export default Page;

export const ensurePages = (geometry, depth = 0) => {
  // console.log(`QQ/ensurePages: ${geometry.isChain}`);
  const pages = getLayouts(geometry);
  if (pages.length === 0 && depth === 0) {
    return ensurePages(
      Page({ pack: false }, toConcreteGeometry(geometry)),
      depth + 1
    );
  } else {
    return pages;
  }
};
