import { isSeqSpec, seq } from '@jsxcad/geometry';

import Shape from './Shape.js';

const resolve = async (
  input,
  value,
  specOptions = {},
  { flattenGroups = false } = {}
) => {
  while (value instanceof Promise) {
    value = await value;
  }
  if (Shape.isFunction(value)) {
    // Functions being resolved to shapes receive the input.
    value = await value(input);
  }
  while (Shape.isPendingInput(value)) {
    // Complete chains should receive their inputs.
    value = await value(input);
  }
  if (Shape.isArray(value)) {
    const resolvedElements = [];
    for (const element of value) {
      const result = await resolve(input, element);
      resolvedElements.push(result);
    }
    return resolvedElements;
  } else if (flattenGroups && Shape.isGroupShape(value)) {
    const flattenedElements = [];
    const walk = (elements) => {
      for (const element of elements) {
        if (element.type === 'group') {
          walk(element.content);
        } else {
          flattenedElements.push(Shape.fromGeometry(element));
        }
      }
    };
    const geometry = await value.toGeometry();
    walk(geometry.content);
    return flattenedElements;
  } else if (Shape.isObject(value)) {
    const resolvedObject = {};
    for (const key of Object.keys(value)) {
      switch (specOptions[key]) {
        case 'geometries': {
          // This should be better integrated with destructuring.
          const geometries = [];
          const values = await resolve(input, value[key]);
          if (Shape.isShape(values)) {
            geometries.push(await values.toGeometry());
          } else if (Shape.isArray(values)) {
            for (const value of values) {
              geometries.push(await value.toGeometry());
            }
          }
          resolvedObject[key] = geometries;
          break;
        }
        default: {
          resolvedObject[key] = await resolve(input, value[key]);
        }
      }
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

export const destructure2 = async (names, input, originalArgs, ...specs) => {
  const output = [];
  let args = [];
  for (const arg of originalArgs) {
    if (arg === undefined) {
      continue;
    }
    args.push(arg instanceof Promise ? await arg : arg);
  }
  for (const baseSpec of specs) {
    const [spec, specOptionText] = baseSpec.split(':');
    const specOptions = {};
    const hasSpecOptions = specOptionText !== undefined;
    if (hasSpecOptions) {
      for (const chunk of specOptionText.split(',')) {
        const [key, value] = chunk.split('=');
        if (value === undefined) {
          specOptions[key] = true;
        } else {
          specOptions[key] = value;
        }
      }
    }
    const rest = [];
    switch (spec) {
      case 'input': {
        output.push(input);
        if (input && input.geometry.geometry) {
          throw Error(`Error: malformedGeometry`);
        }
        rest.push(...args);
        break;
      }
      case 'inputGeometry': {
        if (input === undefined) {
          output.push(undefined);
        } else {
          if (!Shape.isGeometry(input.geometry)) {
            throw Error(
              `Expected geometry but received ${JSON.stringify(input.geometry)}`
            );
          }
          output.push(input.geometry);
        }
        rest.push(...args);
        break;
      }
      case 'objects': {
        const out = [];
        for (const arg of args) {
          if (!Shape.isObject(arg)) {
            // These must be confirmed as objects prior to resolution in order to avoid functions.
            rest.push(arg);
            continue;
          }
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
        const specs = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isNumber(value)) {
            out.push(value);
          } else if (isSeqSpec(value)) {
            specs.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        if (specs.length > 0) {
          out.push(...seq(...specs));
        }
        break;
      }
      case 'string': {
        let string;
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
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
          if (func !== undefined) {
            rest.push(arg);
          } else if (
            Shape.isFunction(value) ||
            Shape.isPendingInput(value) ||
            Shape.isPendingArguments(value)
          ) {
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
          if (
            Shape.isFunction(value) ||
            Shape.isPendingInput(value) ||
            Shape.isPendingArguments(value)
          ) {
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
          let value = await resolve(input, arg, specOptions);
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
          if (result === undefined) {
            let value = await resolve(input, arg, specOptions);
            if (Shape.isShape(value)) {
              result = await value.toGeometry();
              if (!Shape.isGeometry(result)) {
                throw Error('die');
              }
              continue;
            }
          }
          rest.push(arg);
        }
        output.push(result);
        break;
      }
      case 'coordinate': {
        let result;
        for (const arg of args) {
          if (result === undefined) {
            let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
          if (Shape.isObject(value)) {
            Object.assign(options, value);
          } else {
            rest.push(arg);
          }
        }
        output.push(options);
        break;
      }
      case 'strings': {
        const out = [];
        for (const arg of args) {
          if (
            typeof arg === 'string' &&
            (!hasSpecOptions || specOptions[arg] === true)
          ) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'modes': {
        const out = {};
        for (const arg of args) {
          if (typeof arg === 'string' && specOptions[arg] === true) {
            out[arg] = true;
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions, {
            flattenGroups: true,
          });
          if (Shape.isShape(value)) {
            const result = await value.toGeometry();
            out.push(result);
            if (!Shape.isGeometry(result)) {
              throw Error('die');
            }
          } else if (Shape.isArray(value) && value.every(Shape.isShape)) {
            for (const element of value) {
              const result = await element.toGeometry();
              out.push(result);
              if (!Shape.isGeometry(result)) {
                throw Error('die');
              }
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
          let value = await resolve(input, arg, specOptions);
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
      case 'coordinateLists': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isShape(value)) {
            const coordinates = await getCoordinates(value);
            if (coordinates.length > 0) {
              out.push(coordinates);
              continue;
            }
          } else if (Shape.isArray(value) && value.every(Shape.isCoordinate)) {
            out.push(value);
            continue;
          }
          // Otherwise
          rest.push(arg);
        }
        output.push(out);
        break;
      }
      case 'segments': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
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
      diagnostic = `Error[${names}] ${
        args.length
      } unused arguments: ${args.join(',')} JSON=${JSON.stringify(
        args
      )} arguments: ${JSON.stringify(originalArgs)} specs: ${JSON.stringify(
        specs
      )} output=${JSON.stringify(output)}`;
    } catch (error) {
      // Otherwise fall back.
      diagnostic = `Error[${names}] ${
        args.length
      } unused arguments: ${args.join(', ')} specs: ${specs.join(',')}`;
    }
    console.log(diagnostic);
    throw Error(diagnostic);
  }
  return output;
};

Shape.destructure2 = destructure2;
