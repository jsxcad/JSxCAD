import { measureArea } from './measureArea.js';

export const isCounterClockwise = (path) => measureArea(path) > 0;
