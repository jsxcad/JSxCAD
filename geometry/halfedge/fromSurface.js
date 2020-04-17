import fromSolid from './fromSolid';

export const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

export default fromSurface;
