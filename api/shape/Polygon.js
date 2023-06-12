import Shape from './Shape.js';

export const Polygon = Shape.registerMethod2(
  ['Face', 'Polygon'],
  ['coordinates'],
  (coordinates) => Shape.chain(Shape.fromPolygons([{ points: coordinates }]))
);

export const Face = Polygon;

export default Polygon;
