import Shape from './Shape.js';
import { untag } from './untag.js';

export const setTag = Shape.registerMethod2(
  'setTag',
  ['input', 'string', 'value'],
  (input, tag, value) => untag(`${tag}=*`).tag(`${tag}=${value}`)(input)
);

export default setTag;
