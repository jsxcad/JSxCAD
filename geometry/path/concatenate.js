import { close } from './close';

export const concatenate = (...paths) => {
  const result = [null, ...[].concat(...paths.map(close))];
  return result;
};
