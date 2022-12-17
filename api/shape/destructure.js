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
    if (Shape.isValue(arg)) {
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

export const destructure2 = async (shape, args, ...specs) => {
  const output = [];
  for (const spec of specs) {
    const rest = [];
    const out = [];
    output.push(out);
    switch (spec) {
      case 'objects': {
        for (const arg of args) {
          if (Shape.isObject(arg)) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        break;
      }
      case 'modes': {
        for (const arg of args) {
          if (typeof args === 'string') {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        break;
      }
      case 'values': {
        for (let arg of args) {
          while (Shape.isFunction(arg)) {
            arg = await arg(shape);
          }
          if (Shape.isValue(arg)) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        break;
      }
      case 'coordinates': {
        for (let arg of args) {
          while (Shape.isFunction(arg)) {
            arg = await arg(shape);
          }
          if (Shape.isShape(arg)) {
            const points = await arg.toPoints();
            if (points.length >= 1) {
              const point = points[0];
              out.push(point);
            } else {
              throw Error(
                `Unexpected coordinate value: ${JSON.stringify(arg)}`
              );
            }
          } else if (Shape.isArray(arg)) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        break;
      }
    }
    args = rest;
  }
  return output;
};
