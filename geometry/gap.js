import { hasTypeGhost, hasTypeVoid } from './tagged/type.js';

export const gap = (geometry) => hasTypeGhost(hasTypeVoid(geometry));
