import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Group } from './Group.js';
import { Hull } from './Hull.js';
import { Points } from './Points.js';

export const ChainedHull = (...shapes) => {
  const pointsets = shapes.map((shape) => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    chain.push(Hull(Points(...points)));
  }
  return Group(...chain);
};

const chainHullMethod = function (...shapes) {
  return ChainedHull(this, ...shapes);
};

Shape.prototype.chainHull = chainHullMethod;
Shape.prototype.ChainedHull = shapeMethod(ChainedHull);

export default ChainedHull;
