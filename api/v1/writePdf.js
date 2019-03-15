import { pathsToPdf } from '@jsxcad/algorithm-pdf';

export const writePdf = ({ path }, shape) => {
  const paths = shape.toPaths({});
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, pathsToPdf({}, paths));
};
