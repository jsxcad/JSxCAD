export const toGeneric = (solid) =>
  solid.map((surface) =>
    surface.map((polygon) => polygon.map((point) => [...point]))
  );
