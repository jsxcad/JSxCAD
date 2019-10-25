import { ask as askSys } from '@jsxcad/sys';

/**
 *
 * # Ask
 *
 * Queries a parameter, asking the user if not already provided.
 *
 * ```
 * const length = ask('Length');
 * ```
 *
 **/

const askForString = async (identifier, options = {}) => {
  const result = await askSys(identifier, options);
  if (result === undefined) {
    throw Error('Die');
  }
  return result;
};

export const ask = async (...args) => {
  const result = askForString(...args);
  return Number(await result);
};

ask.forNumber = ask;
ask.forString = askForString;
