import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFile } from '@jsxcad/sys';

export const writeThreejsPage = async (options, shape) => {
  const { path } = options;
  const geometry = shape.toDisjointGeometry();
  return writeFile({ geometry }, path, toThreejsPage(options, shape.toDisjointGeometry()));
};
