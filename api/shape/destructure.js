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
    switch (spec) {
      case 'objects': {
        const out = [];
        for (const arg of args) {
          if (Shape.isObject(arg)) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'number': {
        let number;
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (number === undefined && Shape.isNumber(value)) {
            number = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(number);
        break;
      }
      case 'string': {
        let string;
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (string === undefined && Shape.isString(value)) {
            string = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(string);
        break;
      }
      case 'function': {
        let func;
        for (const arg of args) {
          let value = arg;
          if (func === undefined && Shape.isFunction(value)) {
            func = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(func);
        break;
      }
      case 'shape': {
        let result;
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (result === undefined && Shape.isShape(value)) {
            result = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'options': {
        const options = {};
        for (const arg of args) {
          if (Shape.isObject(arg)) {
            Object.assign(options, arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(options);
        break;
      }
      case 'modes': {
        const out = [];
        for (const arg of args) {
          if (typeof arg === 'string') {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'values': {
        const out = [];
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (Shape.isValue(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'shapes': {
        const out = [];
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (Shape.isShape(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'coordinates': {
        const out = [];
        for (const arg of args) {
          let value = arg;
          while (Shape.isFunction(value)) {
            value = await value(shape);
          }
          if (Shape.isShape(value)) {
            const points = await value.toPoints();
            if (points.length >= 1) {
              const point = points[0];
              out.push(point);
            } else {
              throw Error(
                `Unexpected coordinate value: ${JSON.stringify(arg)}`
              );
            }
          } else if (Shape.isArray(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'rest': {
        output.push(args);
        break;
      }
    }
    args = rest;
  }
  if (args.length !== 0) {
    console.log(`QQQ/Error: Unused arguments [${args.join(', ')}]`);
    throw Error(`Unused arguments [${args.join(', ')}]`);
  }
  return output;
};
