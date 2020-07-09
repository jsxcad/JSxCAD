import { readFont } from '@jsxcad/api-v1-font';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-stl';

const string = 'JSxCAD';
const greatVibes = await readFont('ttf/GreatVibes.ttf', {
  src: './great-vibes/GreatVibes-Regular.ttf',
});
const letters = greatVibes(10)(string);

letters.Item().Page().writePdf('text');

letters.extrude(10).center().Item().Page().writeStl('text');
