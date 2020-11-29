import { readFont } from '@jsxcad/api-v1-font';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-stl';

const string = 'JSxCAD';
const greatVibes = await readFont('./great-vibes/GreatVibes-Regular.ttf');
const letters = greatVibes(10)(string);

letters.item().Page().view().writePdf('text');

letters.extrude(10).center().item().Page().view().writeStl('text');
