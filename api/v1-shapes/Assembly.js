import Shape from '@jsxcad/api-v1-shape';
import { taggedAssembly } from '@jsxcad/geometry-tagged';

export const Assembly = (...shapes) =>
  Shape.fromGeometry(
    taggedAssembly({}, ...shapes.map((shape) => shape.toGeometry()))
  );

export default Assembly;
