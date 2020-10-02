import Cgal from './cgal.cjs';
import { onBoot } from '@jsxcad/sys';

let occt;

export const initCgal = async () => {
  if (cgal === undefined) {
    cgal = await Cgal();
  }
};

export const getGal = () => cgal;

onBoot(initCgal);
