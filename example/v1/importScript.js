source('gear', './gear.js');

import { buildGear } from 'gear';

await buildGear({}).Page().writePdf('gear');
