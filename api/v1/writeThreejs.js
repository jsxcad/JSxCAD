import { assemblyToThreejsPage } from '@jsxcad/algorithm-threejs';
import { writeFileSync } from '@jsxcad/sys';

const toPolygons = (shape) => (shape instanceof Array) ? shape : shape.toPolygons({});

export const writeThreejsPage = (options, assembly) => {
  writeFileSync(options.path,
                () => assemblyToThreejsPage(options, assembly),
                { assembly });
};
