import { Shape, toKeptGeometry } from './Shape';

/**
 *
 * # Kept
 *
 * Kept produces a geometry without dropped elements.
 *
 **/

export const kept = (shape) => Shape.fromGeometry(toKeptGeometry(shape));

const method = function () { return kept(this); };

Shape.prototype.kept = method;
