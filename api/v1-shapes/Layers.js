import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedLayers } from '@jsxcad/geometry-tagged';

const isDefined = (value) => value;

export const Layers = (...shapes) =>
  Shape.fromGeometry(
    taggedLayers(
      {},
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

export default Layers;

Shape.prototype.Layers = shapeMethod(Layers);
