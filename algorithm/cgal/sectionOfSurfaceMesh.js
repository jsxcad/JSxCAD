// import { arrangePaths } from './arrangePaths.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const sectionOfSurfaceMesh = (
  mesh,
  transform,
  matrices,
  profile = false
) => {
  const g = getCgal();
  const sections = [];
  g.SectionOfSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    matrices.length,
    (nth) => toCgalTransformFromJsTransform(matrices[nth].matrix),
    (section) => sections.push(section),
    profile
  );
  return sections;
};
