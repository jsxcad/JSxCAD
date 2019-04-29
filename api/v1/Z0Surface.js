import { Assembly } from './Assembly';
import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Z0Surface extends Assembly {}

Z0Surface.fromGeometry = (geometry) => new Z0Surface(fromGeometry(geometry));
Z0Surface.fromPath = (path) => new Z0Surface(fromGeometry({ z0Surface: [path] }));
Z0Surface.fromPaths = (paths) => new Z0Surface(fromGeometry({ z0Surface: paths }));
Z0Surface.fromPolygons = (polygons) => new Z0Surface(fromGeometry({ z0Surface: polygons }));
