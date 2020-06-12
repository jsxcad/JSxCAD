import { measureArea } from "./measureArea";

export const isCounterClockwise = (path) => measureArea(path) > 0;
