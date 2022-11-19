import Shape from './Shape.js';
import { toValue } from './toValue.js';

export const toFlatValues = Shape.registerMethod('toFlatValues', (to) => async (shape) => {
  if (Shape.isFunction(to)) {
    to = await to(shape);
  }
  if (Shape.isArray(to)) {
    const flat = [];
    for (const element of to) {
      if (element === undefined) {
        continue;
      }
      flat.push(await toValue(element)(shape));
    }
    return flat;
  } else if (Shape.isShape(to) && to.toGeometry().type === 'group') {
    return toFlatValues((await to.toGeometry()).content)(shape);
  } else {
    return [await toValue(to)(shape)];
  }
});
