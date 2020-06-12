import Shape from "@jsxcad/api-v1-shape";

export const Assembly = (...shapes) =>
  Shape.fromGeometry({ assembly: shapes.map((shape) => shape.toGeometry()) });

export default Assembly;
