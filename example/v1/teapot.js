import { readStl, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  const teapot = await readStl({ path: 'teapot.stl', format: 'binary' });
  await writeStl({ path: 'tmp/teapot.stla', format: 'ascii' }, teapot);
};
