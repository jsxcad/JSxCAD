export const difference = (...params) => {
  const [shape, ...shapes] = flatten(params);
  return shape.difference(...shapes);
}
