import { XY } from './Ref.js';
import { to } from './to.js';

export const flat = (geometry) => to(geometry, [XY()]);
