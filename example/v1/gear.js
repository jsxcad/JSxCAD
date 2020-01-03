import Gear from '@jsxcad/api-v1-gear';
import '@jsxcad/api-v1-pdf';

export const buildGear = () => Gear.profile();

export const main = async () => await Gear.profile().writePdf('pdf/gear.pdf');
