export const assertBoolean = (value) => {
  if (typeof value !== 'boolean') {
    throw Error(`Not a boolean: ${value}`);
  }
};

export const assertEmpty = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }

  if (value.length !== 0) {
    throw Error(`Is not empty: ${value}`);
  }
};

export const assertSingle = (value) => {
  if (value.length === undefined) {
    throw Error(`Has no length: ${value}`);
  }

  if (value.length !== 1) {
    throw Error(`Is not single: ${value}`);
  }
};

export const assertNumber = (value) => {
  if (typeof value !== 'number') {
    throw Error(`Not a number: ${value}`);
  }
};
