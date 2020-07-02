import Shape from './Shape.js';
import translate from './translate.js';

/**
 *
 * # Move
 *
 * A shorter way to write translate.
 *
 */

export const move = (...args) => translate(...args);

const moveMethod = function (...params) {
  return translate(this, ...params);
};
Shape.prototype.move = moveMethod;

export default move;

move.signature =
  'move(shape:Shape, x:number = 0, y:number = 0, z:number = 0) -> Shape';
moveMethod.signature =
  'Shape -> move(x:number = 0, y:number = 0, z:number = 0) -> Shape';
