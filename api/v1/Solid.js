import { Assembly } from './Assembly';
import { fromGeometry } from '@jsxcad/geometry-assembly';
import { fromPolygons } from '@jsxcad/algorithm-solid';

export class Solid extends Assembly {}

Solid.fromGeometry = (geometry) => new Solid(geometry);
Solid.fromPolygons = (polygons) => new Solid(fromGeometry({ solid: fromPolygons({}, polygons) }));
Solid.fromSurfaces = (surfaces) => new Solid(fromGeometry({ solid: surfaces }));
