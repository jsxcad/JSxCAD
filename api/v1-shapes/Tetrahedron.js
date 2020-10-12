import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { buildRegularTetrahedron } from '@jsxcad/algorithm-shape';
import { taggedSolid } from '@jsxcad/geometry-tagged';

const unitTetrahedron = () =>
  Shape.fromGeometry(taggedSolid({}, buildRegularTetrahedron({}))).toGraph();

export const ofRadius = (radius = 1) => unitTetrahedron().scale(radius);
export const ofDiameter = (diameter = 1) =>
  unitTetrahedron().scale(diameter / 2);

export const Tetrahedron = (...args) => ofRadius(...args);

Tetrahedron.ofRadius = ofRadius;
Tetrahedron.ofDiameter = ofDiameter;

export default Tetrahedron;

Shape.prototype.Tetrahedron = shapeMethod(Tetrahedron);
