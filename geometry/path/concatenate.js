import { close } from './close.js';

export const concatenate = (...paths) => {
  const result = [null, ...[].concat(...paths.map(close))];
  return result;
};
