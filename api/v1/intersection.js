import { Shape, intersectionLazily } from './Shape';

export const intersection = (...params) => intersectionLazily(...params);

const method = function (...shapes) { return intersection(this, ...shapes); };

Shape.prototype.intersection = method;
