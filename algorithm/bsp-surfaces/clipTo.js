import { clipSurfaces } from './clipSurfaces';

// Destructively remove all parts of surfaces from a that are in b.
export const clipTo = (a, b) => {
  a.surfaces = clipSurfaces(b, a.surfaces);
  if (a.front !== undefined) {
    clipTo(a.front, b);
  }
  if (a.back !== undefined) {
    clipTo(a.back, b);
  }
};
