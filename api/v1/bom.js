import Shape from './Shape';

/**
 *
 * # Bill Of Materials
 *
 **/

export const bom = (shape, ...args) => '';

const bomMethod = function (...args) { return bom(this, ...args); };
Shape.prototype.bom = bomMethod;

export default bom;

bomMethod.signature = 'Shape -> bom() -> string';
