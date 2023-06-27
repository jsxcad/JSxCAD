import Shape from './Shape.js';
import { loadGeometry } from './loadGeometry.js';
import { saveGeometry } from './saveGeometry.js';

// This generates anonymous shape methods.
export const Cached = (name, op) =>
  Shape.registerMethod2([], ['rest'], async (args) => {
    const path = `cached/${name}/${JSON.stringify(args)}`;
    // The first time we hit this, we'll schedule a read and throw, then wait for the read to complete, and retry.
    const cached = await loadGeometry(path);
    if (cached) {
      return cached;
    }
    // The read we scheduled last time produced undefined, so we fall through to here.
    const constructedShape = await op(...args);
    // This will schedule a write and throw, then wait for the write to complete, and retry.
    await saveGeometry(path, constructedShape);
    return constructedShape;
  });

export default Cached;
