import {
  removeExteriorPolygonsForSection,
  fromSolid as toBspFromSolid,
} from "./bsp";

import { alignVertices } from "@jsxcad/geometry-solid";

export const section = (solid, surfaces, normalize) => {
  const bsp = toBspFromSolid(alignVertices(solid, normalize), normalize);
  return surfaces.map((surface) =>
    removeExteriorPolygonsForSection(bsp, surface, normalize)
  );
};
