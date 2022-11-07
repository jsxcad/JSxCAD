import Shape from './Shape.js';

export const Edges = Shape.registerShapeMethod('Edges', (segments) =>
  Shape.fromSegments(
    Shape.toNestedValues(segments).map(([source, target]) => [
      Shape.toCoordinate(undefined, source),
      Shape.toCoordinate(undefined, target),
    ])
  ));

export default Edges;
