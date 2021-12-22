import { readShapeCache } from './readShapeCache.js';
import { writeShapeCache } from './writeShapeCache.js';

export const Cached = (name, thunk) => {
  const op = (...args) => {
    const cached = readShapeCache(name, args);
    if (cached) {
      return cached;
    }
    const value = thunk(...args);
    writeShapeCache(name, args, value);
    return value;
  };
  return op;
};
