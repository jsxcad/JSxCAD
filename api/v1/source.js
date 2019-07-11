import { addSource } from '@jsxcad/sys';

export const source = (path, source) => {
  console.log(`QQ/source/path: ${path}`);
  console.log(`QQ/source/source: ${source}`);
  addSource(path, source);
};
