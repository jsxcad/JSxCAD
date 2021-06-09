// import { arrangePaths } from './arrangePaths.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const sectionOfSurfaceMesh = (
  mesh,
  transform,
  planes,
  profile = false
) => {
  const g = getCgal();
  const sections = [];
  g.SectionOfSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    planes.length,
    (nth, out) => {
      const { plane, exactPlane } = planes[nth];
      if (exactPlane) {
        const [a, b, c, d] = exactPlane;
        g.fillExactQuadruple(out, a, b, c, d);
      } else if (plane) {
        const [x, y, z, w] = plane;
        g.fillQuadruple(out, x, y, z, -w);
      }
    },
    (section) => sections.push(section),
    profile
  );
  return sections;
};
