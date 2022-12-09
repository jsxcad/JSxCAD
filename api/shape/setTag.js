import Shape from './Shape.js';
import { untag } from './untag.js';

export const setTag = Shape.registerMethod(
  'setTag',
  (tag, value) => (shape) => untag(`${tag}=*`).tag(`${tag}=${value}`)(shape)
);

export default setTag;
