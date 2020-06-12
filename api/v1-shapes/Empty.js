import Shape from "@jsxcad/api-v1-shape";

export const Empty = (...shapes) =>
  Shape.fromGeometry({
    disjointAssembly: [{ solid: [] }, { surface: [] }, { paths: [] }],
  });

export default Empty;
