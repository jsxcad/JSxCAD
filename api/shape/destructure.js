import Shape from './Shape.js';

export const destructure = (
  args,
  {
    shapes = [],
    shapesAndFunctions = [],
    functions = [],
    arrays = [],
    objects = [],
    strings = [],
    values = [],
    object = {},
    func,
    number,
    string,
    value,
  } = {}
) => {
  for (const arg of args) {
    if (Shape.isShape(arg)) {
      shapes.push(arg);
      shapesAndFunctions.push(arg);
    } else if (Shape.isFunction(arg)) {
      functions.push(arg);
      shapesAndFunctions.push(arg);
      func = arg;
    } else if (Shape.isArray(arg)) {
      arrays.push(arg);
    } else if (Shape.isObject(arg)) {
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
      strings.push(arg);
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
    strings,
    value,
  };
};

Shape.destructure = destructure;
