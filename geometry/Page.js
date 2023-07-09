import { getList, getNot } from './get.js';

import { Box } from './Box.js';
import { Empty } from './Empty.js';
import { Group } from './Group.js';
import { Hershey } from './Hershey.js';
import { alignment } from './alignment.js';
import { by } from './by.js';
import { getLayouts } from './tagged/getLayouts.js';
import { getLeafs } from './tagged/getLeafs.js';
import { ghost } from './ghost.js';
import { hasColor } from './hasColor.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { outline } from './outline.js';
import { pack as packOp } from './pack.js';
import { taggedLayout } from './tagged/taggedLayout.js';
import { tags } from './tag.js';
import { toDisplayGeometry } from './tagged/toDisplayGeometry.js';
import { translate } from './translate.js';

const MIN = 0;
const MAX = 1;
const X = 0;
const Y = 1;

const buildLayout = ({
  layer,
  pageWidth,
  pageLength,
  margin,
  center = false,
}) => {
  /*
  const itemNames = (await getNot('type:ghost').tags('item', list)(layer))
    .filter((name) => name !== '')
    .flatMap((name) => name)
    .sort();
    */
  const itemNames = tags(getNot(layer, ['type:ghost']), ['item'])
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
    title.push(Hershey(text, fontHeight));
  }
  for (let nth = 0; nth < itemNames.length; nth++) {
    title.push(
      translate(Hershey(itemNames[nth], fontHeight), [
        0,
        (nth + 1) * fontHeight,
        0,
      ])
    );
  }
  const visualization = ghost(
    hasColor(
      Group(
        [
          outline(
            Box([Math.max(pageWidth, margin), Math.max(pageLength, margin)])
          ),
          translate(Group(title), [
            pageWidth / -2,
            (pageLength * (1 + labelScale)) / 2,
          ]),
        ],
        'red'
      )
    )
  );
  /*
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
    */
  let layout = taggedLayout(
    { size, margin },
    toDisplayGeometry(layer),
    toDisplayGeometry(visualization)
  );
  if (center) {
    layout = by(layout, alignment(layout));
  }
  return layout;
};

export const Page = (
  geometries,
  { pack, center, a4, individual },
  { size, pageMargin = 5, itemMargin = 1, itemsPerPage = Infinity } = {}
) => {
  if (a4) {
    size = [210, 297];
  }

  if (individual) {
    pack = true;
    itemsPerPage = 1;
  }

  const margin = itemMargin;
  const layers = [];
  for (const geometry of geometries) {
    for (const leaf of getLeafs(geometry)) {
      layers.push(leaf);
    }
  }
  if (!pack && size) {
    const layer = Group(layers);
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
    const layer = Group(layers);
    const packSize = measureBoundingBox(layer);
    if (packSize === undefined) {
      return Empty();
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
    const content = packOp(
      Group(layers),
      (min, max) => {
        packSize[MIN] = min;
        packSize[MAX] = max;
      },
      {
        size,
        pageMargin,
        itemMargin,
        perLayout: itemsPerPage,
      }
    );
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    const pageWidth = Math.max(1, packSize[MAX][X] - packSize[MIN][X]);
    const pageLength = Math.max(1, packSize[MAX][Y] - packSize[MIN][Y]);
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of getList(content, ['pack:layout'])) {
        plans.push(
          buildLayout({
            layer,
            pageWidth,
            pageLength,
            margin,
            center,
          })
        );
      }
      return Group(plans);
    } else {
      const layer = Group(layers);
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
    const contents = packOp(
      Group(layers),
      (min, max) => {
        packSize[MIN] = min;
        packSize[MAX] = max;
      },
      {
        pageMargin,
        itemMargin,
        perLayout: itemsPerPage,
      }
    );
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    // FIX: Using content.size() loses the margin, which is a problem for repacking.
    // Probably page plans should be generated by pack and count toward the size.
    const pageWidth = packSize[MAX][X] - packSize[MIN][X];
    const pageLength = packSize[MAX][Y] - packSize[MIN][Y];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of getList(contents, ['pack:layout'])) {
        const layout = buildLayout({
          layer,
          packSize,
          pageWidth,
          pageLength,
          margin,
          center,
        });
        plans.push(layout);
      }
      return Group(plans);
    } else {
      const layer = Group(layers);
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  }
};

export const page = (
  geometry,
  { pack, center, a4, individual },
  { size, pageMargin = 5, itemMargin = 1, itemsPerPage = Infinity } = {}
) =>
  Page(
    [geometry],
    { pack, center, a4, individual },
    { size, pageMargin, itemMargin, itemsPerPage }
  );

export const ensurePages = (geometry, depth = 0) => {
  const pages = getLayouts(toDisplayGeometry(geometry));
  if (pages.length === 0 && depth === 0) {
    return ensurePages(Page([geometry], { pack: false }), depth + 1);
  } else {
    return pages;
  }
};
