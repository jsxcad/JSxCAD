import './types.js';

import fromSolid from './fromSolid.js';

/**
 * fromSurface
 *
 * @function
 * @param {Surface} surface
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
export const fromSurface = (surface, normalize) =>
  fromSolid([surface], normalize, /* closed= */ false);

export default fromSurface;
