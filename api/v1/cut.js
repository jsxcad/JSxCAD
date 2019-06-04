import { Shape } from './Shape';
import { assemble } from './assemble';
import { cut as cutSolid } from '@jsxcad/geometry-solid';
import { fromPoints } from '@jsxcad/math-plane';
import { getSolids } from '@jsxcad/geometry-tagged';

/**
 *
 * # Cut
 *
 * Cuts a solid into two halves at z = 0, and returns each.
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = cube(10).cut();
 * assemble(top.translate(0, 0, 1),
 *          bottom.translate(0, 0, -1));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = sphere(10).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * const [top, bottom] = sphere(10).rotateY(1).cut();
 * assemble(top.translate(0, 0, 2),
 *          bottom.translate(0, 0, -2));
 * ```
 * :::
 *
 **/

export const cut = ({ z = 0 } = {}, shape) => {
  const solids = getSolids(shape.toKeptGeometry());
  const fronts = [];
  const backs = [];
  for (const solid of solids) {
    const [front, back] = cutSolid(fromPoints([0, 0, z], [1, 0, z], [0, 1, z]), solid);
    fronts.push(Shape.fromSolid(front));
    backs.push(Shape.fromSolid(back));
  }
  return [assemble(...fronts), assemble(...backs)];
};

const method = function (options) { return cut(options, this); };

Shape.prototype.cut = method;
