import { assemblyToThreejsPage } from '@jsxcad/convert-threejs';
import { writeFileSync } from '@jsxcad/sys';

export const writeThreejsPage = (options, assembly) => {
  writeFileSync(options.path,
                () => assemblyToThreejsPage(options, assembly.toGeometry()),
                assembly.toGeometry());
};
