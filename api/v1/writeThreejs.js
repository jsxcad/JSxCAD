import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFileSync } from '@jsxcad/sys';

export const writeThreejsPage = (options, shape) => {
  writeFileSync(options.path,
                () => toThreejsPage(options, shape.toDisjointGeometry()),
                shape.toDisjointGeometry());
};
