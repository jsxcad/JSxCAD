import { getCgal } from './getCgal.js';

export const sectionOfSurfaceMesh = (mesh, planes) => {
  const c = getCgal();
  let nthPlane = 0;
  const sections = [];
  let section;
  let path;
  c.SectionOfSurfaceMesh(
    mesh,
    planes.length,
    (plane) => {
      const [x, y, z, w] = planes[nthPlane++];
      c.fillQuadruple(plane, x, y, z, -w);
      section = [];
      sections.push(section);
    },
    () => {
      path = [];
      section.push(path);
    },
    (x, y, z) => {
      path.push([x, y, z]);
    }
  );
  // Trim the last vertex, which is a duplicate of the first.
  // FIX: Do this in cgal.cc
  for (const section of sections) {
    for (const path of section) {
      path.pop();
    }
  }
  return sections;
};
