import { loadGeometry } from './loadGeometry.js';
import { saveGeometry } from './saveGeometry.js';

export const Cached = (name, thunk, enable = true) => {
  const op = async (...args) => {
    if (!enable) {
      return thunk();
    }
    const path = `cached/${name}/${JSON.stringify(args)}`;
    // The first time we hit this, we'll schedule a read and throw, then wait for the read to complete, and retry.
    const cached = await loadGeometry(path);
    if (cached) {
      return cached;
    }
    // The read we scheduled last time produced undefined, so we fall through to here.
    const shape = await thunk(...args);
    // This will schedule a write and throw, then wait for the write to complete, and retry.
    await saveGeometry(path, shape);
    return shape;
  };
  return op;
};

export default Cached;
