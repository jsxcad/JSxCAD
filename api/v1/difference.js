import { flatten } from './flatten';

export const difference = (...params) => {
  const [shape, ...shapes] = flatten(params);
  return shape.difference(...shapes);
};
