import { getCgal } from './getCgal.js';

export const sectionOfNefPolyhedron = (
  nefPolyhedron,
  x = 0,
  y = 0,
  z = 0,
  w = 0
) => getCgal().SectionOfNefPolyhedron(nefPolyhedron, x, y, z, w);
