import { fromPaths } from '@jsxcad/geometry-solid3bsp';
import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { toGeometry } from './toGeometry';
import { toPoints } from '@jsxcad/algorithm-paths';
import { toTriangles } from '@jsxcad/algorithm-triangles';

export class CSG {
  constructor (geometry) {
    this.geometry = geometry || fromPaths({}, []);
  }

  difference (...shapes) {
    return CSG.fromGeometry(this.geometry.difference(...shapes.map(toGeometry)));
  }

  dump (tag) {
    console.log(`CSG/dump/${tag}: ${JSON.stringify(this.geometry)}`);
    return this;
  }

  intersect (...shapes) {
    return this.intersection(...shapes);
  }

  intersection (...shapes) {
    return CSG.fromGeometry(this.geometry.intersection(...shapes.map(toGeometry)));
  }

  rotate (angles) {
    return this.rotateX(angles[0]).rotateY(angles[1]).rotateZ(angles[2]);
  }

  rotateX (angle) {
    // FIX: Magic numbers.
    return CSG.fromGeometry(this.geometry.transform(fromXRotation(angle * 0.017453292519943295)));
  }

  rotateY (angle) {
    return CSG.fromGeometry(this.geometry.transform(fromYRotation(angle * 0.017453292519943295)));
  }

  rotateZ (angle) {
    return CSG.fromGeometry(this.geometry.transform(fromZRotation(angle * 0.017453292519943295)));
  }

  scale (factor) {
    if (factor.length) {
      // scale([1, 2, 3])
      return CSG.fromGeometry(this.geometry.transform(fromScaling(factor)));
    } else {
      // scale(4)
      return CSG.fromGeometry(this.geometry.transform(fromScaling([factor, factor, factor])));
    }
  }

  setColor () {
    // Does nothing for now.
    return this;
  }

  subtract (...shapes) {
    return this.difference(...shapes);
  }

  toGeometry () {
    return this.geometry;
  }

  toPaths (options) {
    return this.geometry.toPaths(options);
  }

  toPoints (options) {
    return toPoints(options, this.toPaths(options));
  }

  toPolygons (options) {
    return this.toPaths(options);
  }

  translate ([x, y, z]) {
    return CSG.fromGeometry(this.geometry.transform(fromTranslation([x, y, z])));
  }

  union (...shapes) {
    return CSG.fromGeometry(this.geometry.union(...shapes.map(toGeometry)));
  }
}

CSG.fromGeometry = (geometry) => new CSG(geometry);
CSG.fromPaths = (paths) => CSG.fromGeometry(fromPaths({}, toTriangles({}, paths)));
CSG.fromPolygons = CSG.fromPaths;
