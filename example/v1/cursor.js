import { cursor, writePdf } from '@jsxcad/api-v1';

export const main = async () => {
  const shape = cursor()
      .translate(1)
      .rotateZ(90)
      .translate(1)
      .rotateZ(90)
      .translate(1)
      .rotateZ(90)
      .translate(1)
      .rotateZ(90)
      .toShape();
  await writePdf({ path: 'tmp/cursor.pdf' }, shape);
};
