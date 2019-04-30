import { Shape, differenceLazily } from './Shape';

export const difference = (...params) => differenceLazily(...params);

const method = function (...shapes) { return difference(this, ...shapes); };

Shape.prototype.difference = method;
