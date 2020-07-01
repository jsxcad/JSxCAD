import { measureArea } from './measureArea.js';

export const isClockwise = (path) => measureArea(path) < 0;
