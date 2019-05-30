import { Shape, assembleLazily } from './Shape';

/**
 *
 * # Assemble
 *
 * Produces an assembly of shapes that can be manipulated as a single shape.
 *
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * assemble(circle(20).translate([0, 0, -12]),
 *          square(40).translate([0, 0, 16]).outline(),
 *          cylinder(10, 20));
 * ```
 * :::
 *
 * Components of the assembly can be extracted by tag filtering.
 *
 * Components later in the assembly project holes into components earlier in the assembly so that the geometries are disjoint.
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(cube(30).above().as('cube'),
 *          cylinder(10, 40).above().as('cylinder'))
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(cube(30).above().as('cube'),
 *          cylinder(10, 40).above().as('cylinder'))
 *   .keep('cube')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(cube(30).above().as('cube'),
 *          assemble(circle(40),
 *                   circle(50).outline()).as('circles'))
 *   .keep('circles')
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * assemble(cube(30).above().as('cube'),
 *          assemble(circle(40).as('circle'),
 *                   circle(50).outline().as('outline')))
 *   .drop('outline')
 * ```
 * :::
 *
 **/

export const assemble = (...params) => {
  switch (params.length) {
    case 0: {
      return Shape.fromGeometry({ assembly: [] });
    }
    case 1: {
      return params[0];
    }
    default: {
      return assembleLazily(...params);
    }
  }
};

const method = function (...shapes) { return assemble(this, ...shapes); };

Shape.prototype.assemble = method;
