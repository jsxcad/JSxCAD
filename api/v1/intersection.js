export const intersection = (...params) => {
  const [shape, ...shapes] = flatten(params);
  return shape.intersection(...shapes);
}
