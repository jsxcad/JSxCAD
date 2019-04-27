import { isClosed } from './isClosed';

export const concatenate = (...paths) => {
console.log(`QQ/path/concatenate: ${JSON.stringify(paths)}`);
  if (!paths.every(path => !isClosed(path))) {
    throw Error('Cannot concatenate closed paths.');
  }
  const result = [null, ...[].concat(...paths.map(path => path.slice(1)))];
console.log(`QQ/path/result: ${JSON.stringify(result)}`);
  return result;
};
