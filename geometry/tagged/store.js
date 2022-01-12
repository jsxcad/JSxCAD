import { hash } from './hash.js';
import { prepareForSerialization } from './prepareForSerialization.js';
import { write } from '@jsxcad/sys';

export const store = async (geometry) => {
  if (geometry.is_stored) {
    return;
  }
  prepareForSerialization(geometry);
  const uuid = hash(geometry);
  geometry.is_stored = true;
  const stored = { ...geometry };
  if (geometry.content) {
    for (let nth = 0; nth < geometry.content.length; nth++) {
      stored.content[nth] = await store(geometry.content[nth]);
    }
  }
  await write(`hash/${uuid}`, stored);
  // Return a stub for load().
  return { hash: uuid };
};
