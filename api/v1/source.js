import { addSource } from "@jsxcad/sys";

export const source = (path, source) => addSource(`cache/${path}`, source);
