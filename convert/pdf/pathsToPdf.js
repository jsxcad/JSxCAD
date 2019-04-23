import { fromScaling, fromTranslation, multiply } from '@jsxcad/math-mat4';
import { measureBoundingBox, transform } from '@jsxcad/algorithm-paths';

const X = 0;
const Y = 1;

// Not entirely sure how conformant this is, but it seems to work for simple
// cases.

// Width are height are in post-script points.
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

export const pathsToPdf = ({ orientation = 'portrait', unit = 'mm', lineWidth = 0.096, size = [210, 297] }, paths) => {
  // This is the size of a post-script point in mm.
  const pointSize = 0.352777778;
  const scale = 1 / pointSize;
  const [width, height] = size;
  const lines = [];
  const [min, max] = measureBoundingBox(paths);
  // Currently the origin is at the bottom left.
  // Subtract the x min, and the y max, then add the page height to bring
  // it up to the top left. This positions the origin nicely for laser
  // cutting and printing.
  const offset = [-min[X] * scale, (height - max[Y]) * scale, 0];
  const matrix = multiply(fromTranslation(offset),
                          fromScaling([scale, scale, scale]));
  for (const path of transform(matrix, paths)) {
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

  return [].concat(header({ width: width * scale, height: height * scale, lineWidth: lineWidth }),
                   lines,
                   footer).join('\n');
};
