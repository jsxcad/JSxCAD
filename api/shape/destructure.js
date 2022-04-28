import Shape from './Shape.js';

export const destructure = (
  args,
  {
    shapes = [],
    shapesAndFunctions = [],
    functions = [],
    arrays = [],
    objects = [],
    values = [],
    object = {},
    func,
    number,
    string,
    value,
  } = {}
) => {
  for (const arg of args) {
    if (arg instanceof Shape) {
      shapes.push(arg);
      shapesAndFunctions.push(arg);
    } else if (arg instanceof Function) {
      functions.push(arg);
      shapesAndFunctions.push(arg);
      func = arg;
    } else if (arg instanceof Array) {
      arrays.push(arg);
    } else if (arg instanceof Object) {
      objects.push(arg);
      object = Object.assign(object, arg);
    }
    if (typeof arg !== 'object' && typeof arg !== 'function') {
      values.push(arg);
      if (value === undefined) {
        value = arg;
      }
    }
    if (typeof arg === 'number') {
      if (number === undefined) {
        number = arg;
      }
    }
    if (typeof arg === 'string') {
      if (string === undefined) {
        string = arg;
      }
    }
  }
  return {
    shapes,
    shapesAndFunctions,
    functions,
    func,
    arrays,
    objects,
    values,
    object,
    number,
    string,
    value,
  };
};

Shape.destructure = destructure;
