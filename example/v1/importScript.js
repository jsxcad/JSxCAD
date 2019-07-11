source('gear', './gear.js');

import { buildGear } from 'gear';

await buildGear({}).writePdf('pdf/gear.pdf');
