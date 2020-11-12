import { Group } from './Group.js';
import { Hull } from './Hull.js';
import { Points } from './Points.js';
import { Shape } from '@jsxcad/api-v1-shape';

export const ChainedHull = (...shapes) => {
  const pointsets = shapes.map((shape) => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    chain.push(Hull(Points(...points)));
  }
  return Group(...chain);
};

const ChainedHullMethod = function (...args) {
  return ChainedHull(this, ...args);
};
Shape.prototype.ChainedHull = ChainedHullMethod;

export default ChainedHull;
