import { read, write } from '@jsxcad/geometry';

import Shape from './Shape.js';

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

export const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write(shape.toGeometry(), path));
