import Occt from './occt.cjs';
import { onBoot } from '@jsxcad/sys';

let occt;

export const initOcct = async () => {
  if (occt === undefined) {
    occt = await Occt();
  }
};

export const getOcct = () => occt;

onBoot(initOcct);
