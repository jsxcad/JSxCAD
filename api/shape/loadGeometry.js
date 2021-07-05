import Shape from './Shape.js';
import { read } from '@jsxcad/geometry';

const fromUndefined = () => Shape.fromGeometry();

export const loadGeometry = async (
  path,
  { otherwise = fromUndefined } = {}
) => {
  const data = await read(path);
  if (data === undefined) {
    return otherwise();
  } else {
    return Shape.fromGeometry(data);
  }
};
