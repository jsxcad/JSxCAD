import { readFont } from '@jsxcad/api-v1-font';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-stl';

source('ttf/GreatVibes.ttf', './great-vibes/GreatVibes-Regular.ttf');

const string = 'JSxCAD';
const greatVibes = await readFont('ttf/GreatVibes.ttf');
const letters = greatVibes(10)(string);

await letters.writePdf('pdf/text.pdf');

await letters.extrude(10)
             .center()
             .writeStl('stl/text.stl');
