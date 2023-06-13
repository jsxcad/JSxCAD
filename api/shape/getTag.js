import Shape from './Shape.js';
import { list } from './List.js';
import parseNumber from 'parse-number';

export const getTag = Shape.registerMethod2(
  'getTag',
  ['input', 'strings', 'function'],
  (
    input,
    tags,
    op = (...values) =>
      (shape) =>
        shape
  ) => {
    const values = [];
    for (const tag of tags) {
      const tags = input.tags(`${tag}=*`, list);
      if (tags.length === 0) {
        values.push(undefined);
        continue;
      }
      const [, value] = tags[0].split('=');
      const number = parseNumber(value);
      if (isFinite(number)) {
        values.push(value);
        continue;
      }
      values.push(value);
    }
    return op(...values)(input);
  }
);

export default getTag;
