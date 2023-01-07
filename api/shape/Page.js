import { List, list } from './List.js';

import {
  getLayouts,
  getLeafs,
  measureBoundingBox,
  taggedGroup,
  taggedLayout,
} from '@jsxcad/geometry';

import Box from './Box.js';
import Group from './Group.js';
import Hershey from './Hershey.js';
import Shape from './Shape.js';
import { align } from './align.js';
import { destructure2 } from './destructure.js';
import { getNot } from './getNot.js';
import { toDisplayGeometry } from './toDisplayGeometry.js';

const MIN = 0;
const MAX = 1;
const X = 0;
const Y = 1;

const buildLayout = async ({
  layer,
  pageWidth,
  pageLength,
  margin,
  center = false,
}) => {
  const itemNames = (await getNot('type:ghost').tags('item', list)(layer))
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
    title.push(
      await Hershey(itemNames[nth], fontHeight).y((nth + 1) * fontHeight)
    );
  }
  const visualization = await Box(
    Math.max(pageWidth, margin),
    Math.max(pageLength, margin)
  )
    .outline()
    .and(
      Group(...title).move(pageWidth / -2, (pageLength * (1 + labelScale)) / 2)
    )
    .color('red')
    .ghost();
  let layout = Shape.chain(
    Shape.fromGeometry(
      taggedLayout(
        { size, margin },
        await layer.toDisplayGeometry(),
        await visualization.toDisplayGeometry()
      )
    )
  );
  if (center) {
    layout = layout.by(align());
  }
  return layout;
};

export const Page = Shape.registerMethod('Page', (...args) => async (shape) => {
  const [options, modes, shapes] = await destructure2(
    shape,
    args,
    'options',
    'modes',
    'shapes'
  );
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
  for (const shape of shapes) {
    for (const leaf of getLeafs(await shape.toGeometry())) {
      layers.push(leaf);
    }
  }
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
    return buildLayout({
      layer,
      pageWidth,
      pageLength,
      margin,
      center,
    });
  } else if (!pack && !size) {
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    const packSize = measureBoundingBox(await layer.toGeometry());
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
      return buildLayout({
        layer,
        pageWidth,
        pageLength,
        margin,
        center,
      });
    } else {
      return buildLayout({
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
    const content = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
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
      for (const layer of await content.get('pack:layout', List)) {
        plans.push(
          await buildLayout({
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
      return buildLayout({
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
      throw Error('Packing failed');
    }
    // FIX: Using content.size() loses the margin, which is a problem for repacking.
    // Probably page plans should be generated by pack and count toward the size.
    const pageWidth = packSize[MAX][X] - packSize[MIN][X];
    const pageLength = packSize[MAX][Y] - packSize[MIN][Y];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of await contents.get('pack:layout', List)) {
        const layout = await buildLayout({
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
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  }
});

export const page = Shape.registerMethod(
  'page',
  (...args) =>
    (shape) =>
      Page(Shape.chain(shape), ...args)
);

export default Page;

export const ensurePages = async (shape, depth = 0) => {
  if (shape instanceof Promise) {
    throw Error(`ensurePages/shape/promise`);
  }
  const pages = getLayouts(await toDisplayGeometry()(shape));
  if (pages.length === 0 && depth === 0) {
    return ensurePages(await Page({ pack: false }, shape), depth + 1);
  } else {
    return pages;
  }
};
