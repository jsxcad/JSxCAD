import { getEmitted } from './emit.js';

export const getDefinitions = () => {
  const definitions = {};
  for (const note of getEmitted()) {
    if (note.define) {
      definitions[note.define.tag] = note.define.data;
    }
  }
  return definitions;
};
