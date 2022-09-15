import Shape from './Shape.js';

export const Segments = (segments = []) =>
  Shape.fromSegments(
    Shape.toNestedValues(segments).map(([source, target]) => [
      Shape.toCoordinate(undefined, source),
      Shape.toCoordinate(undefined, target),
    ])
  );

export default Segments;

Shape.prototype.Segments = Shape.shapeMethod(Segments);
