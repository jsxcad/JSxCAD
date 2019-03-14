import { pathsToPdf } from '@jsxcad/algorithm-pdf';

export const writePdf = ({ path }, shape) => {
  // Add toPaths geometry interface so that we can include open paths.
  const paths = shape.toPaths({});
console.log(`QQ/paths: ${JSON.stringify(paths)}`)
  // TODO: Need to abstract filesystem access so that it can work in a browser.
  require('fs').writeFileSync(path, pathsToPdf({}, paths));
};
