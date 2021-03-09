import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const card = (strings, ...placeholders) => {
  const card = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ hash: hashSum(card), setContext: { card } });
  return card;
};
