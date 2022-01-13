import { loadGeometryNonblocking } from './loadGeometry.js';
import { saveGeometryNonblocking } from './saveGeometry.js';

export const Cached = (name, thunk) => {
  const op = (...args) => {
    const path = `cached/${name}/${JSON.stringify(args)}`;
    // The first time we hit this, we'll schedule a read and throw, then wait for the read to complete, and retry.
    const cached = loadGeometryNonblocking(path);
    if (cached) {
      return cached;
    }
    // The read we scheduled last time produced undefined, so we fall through to here.
    const shape = thunk(...args);
    // This will schedule a write and throw, then wait for the write to complete, and retry.
    saveGeometryNonblocking(path, shape);
    console.log(`QQ/Cached/shape: ${JSON.stringify(shape)}`);
    return shape;
  };
  return op;
};
