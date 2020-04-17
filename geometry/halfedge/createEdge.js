// This produces a half-edge link.

export const createEdge = (start = [0, 0, 0], face = undefined, next = undefined, twin = undefined) => ({ start, face, next, twin });

export default createEdge;
