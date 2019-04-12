import { readDst, writePdf } from '@jsxcad/api-v1';

export const main = () => {
  const paths = readDst({ path: 'atg-sft003.dst' });
  writePdf({ path: 'tmp/atg-sft003.pdf' }, paths);
};
