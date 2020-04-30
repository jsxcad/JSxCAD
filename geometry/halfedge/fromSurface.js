import fromSolid from './fromSolid';

/**
 * fromSurface
 *
 * @param surface
 * @param normalize
 */
export const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

export default fromSurface;
