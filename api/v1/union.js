import { flatten } from './flatten';

export const union = (...params) => {
  const [shape, ...shapes] = flatten(params);
  return shape.union(...shapes);
}
