import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Assembly {
  as (tag) {
    return this.fromLazyGeometry(toLazyGeometry(this).addTag(tag));
  }

  assemble (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).assemble(...shapes.map(toLazyGeometry)));
  }

  constructor (lazyGeometry = fromGeometry({ assembly: [] })) {
    this.lazyGeometry = lazyGeometry;
  }

  difference (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).difference(...shapes.map(toLazyGeometry)));
  }

  fromLazyGeometry (geometry) {
    return Assembly.fromLazyGeometry(geometry);
  }

  intersection (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).intersection(...shapes.map(toLazyGeometry)));
  }

  toLazyGeometry () {
    return this.lazyGeometry;
  }

  toComponents (options = {}) {
    return toLazyGeometry(this).toComponents(options);
  }

  toDisjointGeometry(options = {}) {
    const geometry = toLazyGeometry(this).toDisjointGeometry(options);
console.log(`QQ/Assembly/toDisjointGeometry/this: ${JSON.stringify(this)}`);
console.log(`QQ/Assembly/toDisjointGeometry/lazyGeometry: ${JSON.stringify(toLazyGeometry(this))}`);
console.log(`QQ/Assembly/toDisjointGeometry/disjointGeometry: ${JSON.stringify(geometry)}`);
    return geometry;
  }

  toPaths (options = {}) {
    return toLazyGeometry(this).toPaths(options);
  }

  toPoints (options = {}) {
    return toLazyGeometry(this).toPoints(options);
  }

  toSolid (options = {}) {
console.log(`QQ/Assembly/toSolid/this: ${JSON.stringify(this)}`);
    return toLazyGeometry(this).toSolid(options);
  }

  toZ0Surface (options = {}) {
console.log(`QQ/Assembly/toZ0Surface/this; ${JSON.stringify(this)}`);
console.log(`QQ/Assembly/toZ0Surface/lazy; ${JSON.stringify(toLazyGeometry(this))}`);
    return toLazyGeometry(this).toZ0Surface(options);
  }

  transform (matrix) {
console.log(`QQ/Solid/transform/this: ${JSON.stringify(this)}`);
console.log(`QQ/Solid/transform/toLazyGeometry: ${JSON.stringify(toLazyGeometry(this))}`);
    return this.fromLazyGeometry(toLazyGeometry(this).transform(matrix));
  }

  union (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).union(...shapes.map(toLazyGeometry)));
  }
}

const toLazyGeometry = (shape) => shape.toLazyGeometry();

export const assembleLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).assemble(...shapes.map(toLazyGeometry)));

export const unionLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).union(...shapes.map(toLazyGeometry)));

export const differenceLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).difference(...shapes.map(toLazyGeometry)));

export const intersectionLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).intersection(...shapes.map(toLazyGeometry())));

Assembly.fromLazyGeometry = (geometry) => new Assembly(geometry);
