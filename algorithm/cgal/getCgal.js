import Cgal from './cgal.cjs';
import { onBoot } from '@jsxcad/sys';

let cgal;

export const initCgal = async () => {
  if (cgal === undefined) {
    cgal = await Cgal();
  }
};

export const getCgal = () => cgal;

onBoot(initCgal);
