import { Shape } from './Shape';
import { translate } from './translate';

/**
 *
 * # Move
 *
 * A shorter way to write translate.
 *
 */

const move = translate;

export { move };

const method = function (...params) { return translate(this, ...params); };
Shape.prototype.move = method;
