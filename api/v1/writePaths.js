import { writeFileSync } from '@jsxcad/sys';

export const writePaths = ({ path }, ...paths) => {
  writeFileSync(path, paths);
};
