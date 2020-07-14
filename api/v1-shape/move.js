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
