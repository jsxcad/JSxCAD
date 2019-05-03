import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  const { path } = options;
  return writeFile(path,
                   await toThreejsPage(options, shape.toDisjointGeometry()),
                   shape.toDisjointGeometry());
};
