import { assemblyToThreejsPage } from '@jsxcad/convert-threejs';
import { writeFileSync } from '@jsxcad/sys';

export const writeThreejsPage = (options, { paths, surfaces, solids }) => {
  writeFileSync(options.path,
                () => assemblyToThreejsPage(options, { paths, surfaces, solids }),
                { paths, surfaces, solids });
};
