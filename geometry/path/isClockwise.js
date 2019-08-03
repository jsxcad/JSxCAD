import { measureArea } from './measureArea';

export const isClockwise = (path) => measureArea(path) < 0;
