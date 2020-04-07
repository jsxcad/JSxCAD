import Gear from '@jsxcad/api-v1-gear';
import '@jsxcad/api-v1-pdf';

export const buildGear = () => Gear.profile();

await Gear.profile().Page().writePdf('gear');
