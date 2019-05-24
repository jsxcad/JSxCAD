import { Shape } from './Shape';

export const assert = (value, message, pass) => {
  if (pass !== true) {
    throw Error(`${message}: ${value}`);
  }
  return true;
};

export const assertBoolean = (value) => {
  if (typeof value !== 'boolean') {
    throw Error(`Not a boolean: ${value}`);
  }
  return true;
};

export const assertEmpty = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  if (value.length !== 0) {
    throw Error(`Is not empty: ${value}`);
  }
  return true;
};

export const assertShape = (value) => {
  if (value instanceof Shape) {
    return true;
  }
  throw Error(`Is not Shape: ${value}`);
}

export const assertString = (value) => {
  if (typeof value === 'string') {
    return true;
  }
  throw Error(`Is not string: ${value}`);
}

export const assertStrings = (value) => {
  if (value instanceof Array && value.every(item => typeof item === 'string')) {
    return true;
  }
  throw Error(`Is not a list of strings: ${value}`);
}

export const assertSingle = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  if (value.length !== 1) {
    throw Error(`Is not single: ${value}`);
  }
  return true;
};

export const assertPoint = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  const [x, y, z = 0] = value;
  assertNumber(x);
  assertNumber(y);
  assertNumber(z);
  return true;
};

export const assertPoints = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  value.forEach(assertPoint);
  return true;
};

export const assertNumber = (...values) => {
  for (const value of values) {
    if (typeof value !== 'number') {
      throw Error(`Not a number: ${value}`);
    }
  }
  return true;
};

export const assertNumberTriple = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }
  if (value.length !== 3) {
    throw Error(`Is not a triple: ${value}`);
  }
  for (const v of value) {
    assertNumber(v);
  }
  return true;
};
