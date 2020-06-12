import { isClosed } from "./isClosed";

export const close = (path) => (isClosed(path) ? path : path.slice(1));
