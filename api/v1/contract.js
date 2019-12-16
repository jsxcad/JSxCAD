import Shape from './Shape';
import expand from './expand';

/**
 *
 * # contract
 *
 * Moves the edges of the shape inward by the specified amount.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).wireframe().with(Cube(10).contract(2))
 * ```
 * :::
 **/

export const byRadius = (shape, amount = 1, { resolution = 16 } = {}) => expand(shape, -amount, resolution);

export const contract = (...args) => byRadius(...args);

contract.byRadius = byRadius;

const contractMethod = function (radius, resolution) { return contract(this, radius, resolution); };
Shape.prototype.contract = contractMethod;

export default contract;

contract.signature = 'contract(shape:Shape, amount:number = 1, { resolution:number = 16 }) -> Shape';
contractMethod.signature = 'Shape -> contract(amount:number = 1, { resolution:number = 16 }) -> Shape';
