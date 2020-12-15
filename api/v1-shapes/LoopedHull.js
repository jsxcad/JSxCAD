import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Group } from './Group.js';
import { Hull } from './Hull.js';
import { Points } from './Points.js';

export const LoopedHull = (...shapes) => {
  const pointsets = shapes.map((shape) => shape.toPoints());
  const loop = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    loop.push(Hull(Points(...points)));
  }
  loop.push(Hull(Points(...pointsets[pointsets.length - 1], ...pointsets[0])));
  return Group(...loop);
};

const loopHullMethod = function (...shapes) {
  return LoopedHull(this, ...shapes);
};

Shape.prototype.loopHull = loopHullMethod;
Shape.prototype.LoopedHull = shapeMethod(LoopedHull);

export default LoopedHull;
