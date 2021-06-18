import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const card = (strings, ...placeholders) => {
  const card = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  const setContext = { card };
  emit({ hash: hashSum(setContext), setContext });
  return card;
};

export const emitSourceLocation = ({ line, column }) => {
  const setContext = { sourceLocation: { line, column } };
  emit({ hash: hashSum(setContext), setContext });
  return card;
};
