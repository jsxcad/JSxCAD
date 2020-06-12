import { addPending, emit, writeFile } from "@jsxcad/sys";
import { getLeafs, getPlans } from "@jsxcad/geometry-tagged";

import Shape from "@jsxcad/api-v1-shape";
import { toSvg as convertToSvg } from "@jsxcad/convert-svg";
import { ensurePages } from "@jsxcad/api-v1-plans";

export const downloadSvg = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      const op = convertToSvg(leaf, options);
      addPending(op);
      entries.push({
        data: op,
        filename: `${name}_${++index}.svg`,
        type: "image/svg+xml",
      });
    }
  }
  emit({ download: { entries } });
  return shape;
};

const downloadSvgMethod = function (...args) {
  return downloadSvg(this, ...args);
};
Shape.prototype.downloadSvg = downloadSvgMethod;

export const toSvg = async (shape, options = {}) => {
  const pages = [];
  // CHECK: Should this be limited to Page plans?
  const geometry = shape.toKeptGeometry();
  for (const entry of getPlans(geometry)) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        const svg = await convertToSvg(leaf);
        pages.push({
          svg,
          leaf: { ...entry, content: leaf },
          index: pages.length,
        });
      }
    }
  }
  return pages;
};

/*
export const writeSvg = async (shape, name, options = {}) => {
  for (const { svg, leaf, index } of await toSvg(shape, options)) {
    await writeFile({ doSerialize: false }, `output/${name}_${index}.svg`, svg);
    await writeFile({}, `geometry/${name}_${index}.svg`, toKeptGeometry(leaf));
  }
};
*/

export const writeSvg = async (shape, name, options = {}) => {
  let index = 0;
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      const svg = await convertToSvg(leaf, options);
      await writeFile(
        { doSerialize: false },
        `output/${name}_${index}.svg`,
        svg
      );
    }
  }
};

const method = function (...args) {
  return writeSvg(this, ...args);
};
Shape.prototype.writeSvg = method;

export default writeSvg;
