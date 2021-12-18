import Shape from './Shape.js';

export const Face = (...points) =>
  Shape.fromPolygons([
    { points: points.map((point) => Shape.toCoordinate(undefined, point)) },
  ]);

export default Face;

Shape.prototype.Face = Shape.shapeMethod(Face);
