import Shape from '@jsxcad/api-v1-shape';

/**
 *
 * # Bill Of Materials
 *
 **/

export const bom = (shape, ...args) => '';

const bomMethod = function (...args) { return bom(this, ...args); };
Shape.prototype.bom = bomMethod;

bomMethod.signature = 'Shape -> bom() -> string';

export default bom;
