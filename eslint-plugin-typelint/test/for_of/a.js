/** @type {function(triangle:Triangle):Triangle} */
const a = (triangle) => triangle;

/** @type {function(triangles:Triangle[]):Triangle[]} */
export const b = (triangles) => {
  /** @type {Triangle[]} */
  const out = [];
  for (const triangle of triangles) {
    out.push(a(triangle));
  }
  return out;
};
