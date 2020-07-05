import { Shape, fromGeometry, toGeometry } from './Shape.js';

import {
  assemble as assembleGeometry,
  taggedAssembly,
} from '@jsxcad/geometry-tagged';

/**
 *
 * # Assemble
 *
 * Produces an assembly of shapes that can be manipulated as a single shape.
 * assemble(a, b) is equivalent to a.with(b).
 *
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * assemble(Circle(20).moveZ(-12),
 *          Square(40).moveZ(16).outline(),
 *          Cylinder(10, 20));
 * ```
 * :::
 *
 * Components of the assembly can be extracted by tag filtering.
 *
 * Components later in the assembly project holes into components earlier in the
 * assembly so that the geometries are disjoint.
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          Cylinder(10, 40).above().as('cylinder'))
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          Cylinder(10, 40).above().as('cylinder'))
 *   .keep('cube')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          assemble(Circle(40),
 *                   Circle(50).outline()).as('circles'))
 *   .keep('circles')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(Cube(30).above().as('cube'),
 *          assemble(Circle(40).as('circle'),
 *                   Circle(50).outline().as('outline')))
 *   .drop('outline')
 * ```
 * :::
 *
 **/

export const assemble = (...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(taggedAssembly({}));
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(assembleGeometry(...shapes.map(toGeometry)));
    }
  }
};

export default assemble;
