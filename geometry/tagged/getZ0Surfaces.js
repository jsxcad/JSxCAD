import { eachItem } from "./eachItem";

export const getZ0Surfaces = (geometry) => {
  const z0Surfaces = [];
  eachItem(geometry, (item) => {
    if (item.z0Surface) {
      z0Surfaces.push(item);
    }
  });
  return z0Surfaces;
};
