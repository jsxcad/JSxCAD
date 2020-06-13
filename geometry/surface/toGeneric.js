export const toGeneric = (surface) =>
  surface.map((path) => path.map((point) => [...point]));
