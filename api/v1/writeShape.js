import { writeFileSync } from '@jsxcad/sys';

export const writeShape = ({ path }, ...shapes) => {
  writeFileSync(path, shapes.map(shape => shape.toPaths({})));
};
