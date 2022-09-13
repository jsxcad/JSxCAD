import Shape from './Shape.js';

export const Face = (...points) =>
  Shape.fromPolygons([{ points: Shape.toCoordinates(undefined, points) }]);

export default Face;

Shape.prototype.Face = Shape.shapeMethod(Face);
