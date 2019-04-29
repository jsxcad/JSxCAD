import { isClosed } from './isClosed';

export const concatenate = (...paths) => {
  if (!paths.every(path => !isClosed(path))) {
    throw Error('Cannot concatenate closed paths.');
  }
  const result = [null, ...[].concat(...paths.map(path => path.slice(1)))];
  return result;
};
