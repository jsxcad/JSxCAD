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
  while (value instanceof Promise) {
    value = await value;
  }
  while (Shape.isFunction(value)) {
    value = await value(shape);
  }
  if (Shape.isArray(value)) {
    const resolvedElements = [];
    for (const element of value) {
      const result = await resolve(shape, element);
      resolvedElements.push(result);
    }
    return resolvedElements;
  } else if (Shape.isObject(value)) {
    const resolvedObject = {};
    for (const key of Object.keys(value)) {
      resolvedObject[key] = await resolve(shape, value[key]);
    }
    return resolvedObject;
  } else {
    return value;
  }
};

const getCoordinate = async (value) => {
  if (Shape.isCoordinate(value)) {
    return value;
  }
  if (Shape.isShape(value)) {
    const points = await value.toCoordinates();
    if (points.length >= 1) {
      const [x = 0, y = 0, z = 0] = points[0];
      return [x, y, z];
    }
  }
  return undefined;
};

const getCoordinates = async (value) => {
  const coordinates = [];
  for (const [x = 0, y = 0, z = 0] of await value.toCoordinates()) {
    coordinates.push([x, y, z]);
  }
  return coordinates;
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
          if (!Shape.isObject(arg)) {
            // These must be confirmed as objects prior to resolution in order to avoid functions.
            rest.push(arg);
            continue;
          }
          let value = await resolve(shape, arg);
          if (Shape.isObject(value)) {
            out.push(value);
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
      case 'value': {
        let number;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (number === undefined && Shape.isValue(value)) {
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
      case 'functions': {
        const functions = [];
        for (const arg of args) {
          const value = arg;
          if (Shape.isFunction(value)) {
            functions.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(functions);
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
          if (result === undefined) {
            let value = await resolve(shape, arg);
            result = await getCoordinate(value);
            if (result === undefined) {
              rest.push(arg);
            }
          } else if (result !== undefined) {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'options': {
        const options = {};
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isObject(value)) {
            Object.assign(options, value);
          } else {
            rest.push(arg);
          }
        }
        output.push(options);
        break;
      }
      case 'strings':
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
          let value = await resolve(shape, arg);
          if (interval === undefined && Shape.isIntervalLike(value)) {
            interval = Shape.normalizeInterval(value);
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
          let value = await resolve(shape, arg);
          if (Shape.isIntervalLike(value)) {
            out.push(Shape.normalizeInterval(value));
          } else if (
            Shape.isArray(value) &&
            value.every(Shape.isIntervalLike)
          ) {
            for (const element of value) {
              out.push(Shape.normalizeInterval(element));
            }
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
          } else if (Shape.isArray(value) && value.every(Shape.isShape)) {
            for (const element of value) {
              out.push(await element.toGeometry());
            }
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
            const coordinates = await getCoordinates(value);
            if (coordinates.length > 0) {
              out.push(...coordinates);
            } else {
              rest.push(arg);
            }
          } else if (Shape.isArray(value) && Shape.isNumber(value[0])) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'segments': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isSegment(value)) {
            out.push(value);
          } else if (Shape.isArray(value) && value.every(Shape.isSegment)) {
            out.push(...value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'coordinateLists': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isArray(value) && value.every(Shape.isCoordinate)) {
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
        throw Error(`Unknown destructure2 spec "${spec}"`);
      }
    }
    args = rest;
  }
  if (args.length !== 0) {
    let diagnostic;
    try {
      // Try to format it nicely.
      diagnostic = `QQQ/Error: ${
        args.length
      } unused arguments: ${JSON.stringify(args)} arguments: ${JSON.stringify(
        input
      )} specs: ${JSON.stringify(specs)}`;
    } catch (error) {
      // Otherwise fall back.
      diagnostic = `QQQ/Error: ${args.length} unused arguments: ${args.join(
        ', '
      )} specs: ${specs.join(',')}`;
    }
    console.log(diagnostic);
    throw Error(diagnostic);
  }
  return output;
};

Shape.destructure2 = destructure2;

export const destructure2a = async (shape, args, inputSpec, ...specs) => {
  switch (inputSpec) {
    case undefined:
      return destructure2(shape, args, ...specs);
    case 'input':
      return [shape, ...(await destructure2(shape, args, ...specs))];
    case 'inputGeometry':
      return [shape.geometry, ...(await destructure2(shape, args, ...specs))];
    default:
      return destructure2(shape, args, inputSpec, ...specs);
  }
};

Shape.destructure2a = destructure2a;
