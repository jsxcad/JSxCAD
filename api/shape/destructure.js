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

const resolve = async (shape, value) => {
  while (Shape.isFunction(value)) {
    value = await value(shape);
  }
  return value;
};

const resolveArray = async (shape, arg) => {
  const value = await resolve(shape, arg);
  if (Shape.isArray(value)) {
    const resolved = [];
    for (const element of value) {
      resolved.push(await resolve(shape, element));
    }
    return resolved;
  }
  return value;
};

const getCoordinate = async (value) => {
  const points = await value.toPoints();
  if (points.length >= 1) {
    return points[0];
  } else {
    throw Error(`Unexpected coordinate value: ${JSON.stringify(value)}`);
  }
};

export const destructure2 = async (shape, input, ...specs) => {
  const output = [];
  let args = [];
  for (const arg of input) {
    if (arg === undefined) {
      continue;
    }
    args.push(arg instanceof Promise ? await arg : arg);
  }
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
          let value = await resolve(shape, arg);
          if (number === undefined && Shape.isNumber(value)) {
            number = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(number);
        break;
      }
      case 'numbers': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isNumber(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'string': {
        let string;
        for (const arg of args) {
          let value = await resolve(shape, arg);
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
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'geometry': {
        let result;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = await value.toGeometry();
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'coordinate': {
        let result;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = await getCoordinate(value);
          } else if (result === undefined && Shape.isArray(value)) {
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
          let value = await resolve(shape, arg);
          if (Shape.isValue(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'interval': {
        let interval;
        for (const arg of args) {
          let value = await resolveArray(shape, arg);
          if (interval === undefined && Shape.isArray(value)) {
            const [a = 0, b = 0] = value;
            interval = a < b ? [a, b] : [b, a];
          } else if (interval === undefined && Shape.isNumber(value)) {
            // A number implies an interval of that size centered on zero.
            interval =
              value > 0 ? [value / -2, value / 2] : [value / 2, value / -2];
          } else {
            rest.push(arg);
          }
        }
        output.push(interval);
        break;
      }
      case 'intervals': {
        const out = [];
        for (const arg of args) {
          let value = await resolveArray(shape, arg);
          if (Shape.isArray(value)) {
            const [a = 0, b = 0] = value;
            out.push(a < b ? [a, b] : [b, a]);
          } else if (Shape.isNumber(value)) {
            // A number implies an interval of that size centered on zero.
            out.push(
              value > 0 ? [value / -2, value / 2] : [value / 2, value / -2]
            );
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
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            out.push(value);
          } else if (Shape.isArray(value) && value.every(Shape.isShape)) {
            out.push(...value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'geometries': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            out.push(await value.toGeometry());
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
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            value = await getCoordinate(value);
          } else if (Shape.isArray(value)) {
            value = await resolveArray(shape, value);
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
      case 'rest': {
        output.push(args);
        break;
      }
      default: {
        throw Error(`Unknown destructure2 spec ${spec}`);
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
