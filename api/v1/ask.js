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

const askForString = async (identifier, value, options = {}) => {
  if (value instanceof Array) {
    return askForString(identifier, value[0], { ...options, choices: value });
  } else {
    return askSys(identifier, { ...options, initially: value });
  }
};

const askForBool = async (identifier, value = false, options = {}) => {
  return askForString(identifier, value, { ...options, choices: [true, false] });
};

export const askForNumber = async (identifier, value = 0, options = {}) => {
  const result = await askForString(identifier, value, options);
  if (typeof result === 'string') {
    try {
      return Number(result);
    } catch (e) {
      return value;
    }
  } else {
    return result;
  }
};

export const ask = async (...args) => askForNumber(...args);

ask.forNumber = askForNumber;
ask.forString = askForString;
ask.forBool = askForBool;

export default ask;

ask.signature = 'ask(parameter:string) -> number';
ask.forNumber.signature = 'ask(parameter:string, value:number = 0) -> number';
ask.forString.signature = 'ask(parameter:string, value) -> string';
ask.forBool.signature = 'ask(parameter:string, value:boolean = false) -> boolean';
