import { readDst, writePdf } from '@jsxcad/api-v1';

export const main = async () => {
  const paths = await readDst({ path: 'atg-sft003.dst' });
  await writePdf({ path: 'tmp/atg-sft003.pdf' }, paths);
};
