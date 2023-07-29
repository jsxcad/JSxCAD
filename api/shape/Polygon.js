import Shape from './Shape.js';
import { fromPolygons as op } from '@jsxcad/geometry';

export const Polygon = Shape.registerMethod3Pre(
  ['Face', 'Polygon'],
  ['coordinates'],
  (coordinates) => [[{ points: coordinates }]],
  op
);

export const Face = Polygon;

export default Polygon;
