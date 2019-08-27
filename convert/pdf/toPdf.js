import { fromScaling, fromTranslation, multiply } from '@jsxcad/math-mat4';
import { getPaths, getSurfaces, getZ0Surfaces, measureBoundingBox, toKeptGeometry, transform } from '@jsxcad/geometry-tagged';

import { makeConvex as makeConvexSurface } from '@jsxcad/geometry-surface';
import { makeConvex as makeConvexZ0Surface } from '@jsxcad/geometry-z0surface';
import { toRgb } from '@jsxcad/algorithm-color';

const toFillColor = (rgb) => `${(rgb[0] / 255).toFixed(9)} ${(rgb[1] / 255).toFixed(9)} ${(rgb[2] / 255).toFixed(9)} rg`;
const toStrokeColor = (rgb) => `${(rgb[0] / 255).toFixed(9)} ${(rgb[1] / 255).toFixed(9)} ${(rgb[2] / 255).toFixed(9)} RG`;

const X = 0;
const Y = 1;

// Not entirely sure how conformant this is, but it seems to work for simple
// cases.

// Width and height are in post-script points.
const header = ({ width = 595, height = 841, lineWidth = 0.096 }) =>
  [`%PDF-1.5`,
   `1 0 obj << /Pages 2 0 R /Type /Catalog >> endobj`,
   `2 0 obj << /Count 1 /Kids [ 3 0 R ] /Type /Pages >> endobj`,
   `3 0 obj <<`,
   `  /Contents 4 0 R`,
   `  /MediaBox [ 0 0 ${width.toFixed(9)} ${height.toFixed(9)} ]`,
   `  /Parent 2 0 R`,
   `  /Type /Page`,
   `>>`,
   `endobj`,
   `4 0 obj << >>`,
   `stream`,
   `${lineWidth.toFixed(9)} w`];

const footer =
   [`endstream`,
    `endobj`,
    `trailer << /Root 1 0 R /Size 4 >>`,
    `%%EOF`];

export const toPdf = async ({ orientation = 'portrait', unit = 'mm', lineWidth = 0.096, size = [210, 297] }, geometry) => {
  geometry = await geometry;

  // This is the size of a post-script point in mm.
  const pointSize = 0.352777778;
  const scale = 1 / pointSize;
  const [width, height] = size;
  const lines = [];
  const matrix = multiply(fromTranslation([width * scale / 2, height * scale / 2, 0]),
                          fromScaling([scale, scale, scale]));
  const keptGeometry = toKeptGeometry(transform(matrix, geometry));
  for (const { tags, surface } of getSurfaces(keptGeometry)) {
    lines.push(toFillColor(toRgb(tags)));
    for (const path of makeConvexSurface({}, surface)) {
      let nth = (path[0] === null) ? 1 : 0;
      const [x1, y1] = path[nth];
      lines.push(`${x1.toFixed(9)} ${y1.toFixed(9)} m`); // move-to.
      for (nth++; nth < path.length; nth++) {
        const [x2, y2] = path[nth];
        lines.push(`${x2.toFixed(9)} ${y2.toFixed(9)} l`); // line-to.
      }
      lines.push(`h`); // Surface paths are always closed.
      lines.push(`f`); // Surface paths are always filled.
    }
  }
  for (const { tags, z0Surface } of getZ0Surfaces(keptGeometry)) {
    lines.push(toFillColor(toRgb(tags)));
    // FIX: Avoid making the surface convex.
    for (const path of makeConvexZ0Surface({}, z0Surface)) {
      let nth = (path[0] === null) ? 1 : 0;
      const [x1, y1] = path[nth];
      lines.push(`${x1.toFixed(9)} ${y1.toFixed(9)} m`); // move-to.
      for (nth++; nth < path.length; nth++) {
        const [x2, y2] = path[nth];
        lines.push(`${x2.toFixed(9)} ${y2.toFixed(9)} l`); // line-to.
      }
      lines.push(`h`); // Surface paths are always closed.
      lines.push(`f`); // Surface paths are always filled.
    }
  }
  for (const { tags, paths } of getPaths(keptGeometry)) {
    lines.push(toStrokeColor(toRgb(tags)));
    for (const path of paths) {
      let nth = (path[0] === null) ? 1 : 0;
      const [x1, y1] = path[nth];
      lines.push(`${x1.toFixed(9)} ${y1.toFixed(9)} m`); // move-to.
      for (nth++; nth < path.length; nth++) {
        const [x2, y2] = path[nth];
        lines.push(`${x2.toFixed(9)} ${y2.toFixed(9)} l`); // line-to.
      }
      if (path[0] !== null) {
        // A leading null indicates an open path.
        lines.push(`h`); // close path.
      }
      lines.push(`S`); // stroke.
    }
  }

  return [].concat(header({ width: width * scale, height: height * scale, lineWidth: lineWidth }),
                   lines,
                   footer).join('\n');
};
