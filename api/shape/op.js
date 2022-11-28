import Group from './Group.js';
import Shape from './Shape.js';

export const op = Shape.registerMethod('op', (...fns) => async (shape) => {
  const results = [];
  for (const fn of fns) {
    if (fn === undefined) {
      continue;
    }
    if (Shape.isShape(fn)) {
      // console.log(`QQ/op/value: ${fn} ${JSON.stringify(fn)} ${fn.isChain}`);
      results.push(fn);
    } else {
      // console.log(`QQ/op/apply: ${fn} ${JSON.stringify(fn)} ${fn.isChain}`);
      const result = await fn(Shape.chain(shape));
      // console.log(`QQ/op/apply/result: ${result}`);
      results.push(result);
    }
  }
  return Group(...results);
});
