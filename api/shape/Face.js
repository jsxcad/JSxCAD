import Shape from './Shape.js';

export const Face = Shape.registerShapeMethod('Face', (...points) =>
  Shape.fromPolygons([{ points: Shape.toCoordinates(undefined, points) }])
);

export default Face;
