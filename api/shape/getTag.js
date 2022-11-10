import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { list } from './List.js';
import parseNumber from 'parse-number';

export const getTag = Shape.registerMethod('getTag', (...args) => (shape) => {
  const {
    strings: tags,
    func: op = (...values) =>
      (shape) =>
        shape,
  } = destructure(args);
  const values = [];
  for (const tag of tags) {
    const tags = shape.tags(`${tag}=*`, list);
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
  return op(...values)(shape);
});

export default getTag;
