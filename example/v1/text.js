import { readFont, writePdf, writeStl } from '@jsxcad/api-v1';

Error.stackTraceLimit = Infinity;

export const main = async ({ string = 'JSxCAD' }) => {
  const greatVibes = await readFont({ path: './great-vibes/GreatVibes-Regular.ttf' });
  const letters = greatVibes({}, string);

  await writePdf({ path: 'tmp/text.pdf' }, letters);
  const solid = letters.extrude(10).center();
  await writeStl({ path: 'tmp/text.stl' }, solid);
};
