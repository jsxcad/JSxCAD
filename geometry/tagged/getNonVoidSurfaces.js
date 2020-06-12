import { eachNonVoidItem } from "./eachNonVoidItem";

export const getNonVoidSurfaces = (geometry) => {
  const surfaces = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.surface) {
      surfaces.push(item);
    }
  });
  return surfaces;
};
