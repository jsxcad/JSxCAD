/* @module */

import { Loops, Normalizer, Surface } from './types';

import fromSolid from './fromSolid';

/**
 * fromSurface
 *
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
export const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

export default fromSurface;
