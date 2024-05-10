import Shape from './Shape.js';
import { fromPolygonSoup as op } from '@jsxcad/geometry';

export const Polygon = Shape.registerMethod3(
  ['Face', 'Polygon'],
  ['coordinates'],
  (coordinates) => op([{ points: coordinates }])
);

export const Face = Polygon;

export default Polygon;
