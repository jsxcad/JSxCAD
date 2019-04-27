import { toPdf } from '@jsxcad/convert-pdf';
import { writeFileSync } from '@jsxcad/sys';

export const writePdf = ({ path }, ...shapes) => {
console.log(`QQ/writePdf/shapes: ${JSON.stringify(shapes)}`);
  const geometry = { assembly: shapes.map(shape => shape.toDisjointGeometry()) };
  writeFileSync(path, () => toPdf({}, geometry), geometry);
};
