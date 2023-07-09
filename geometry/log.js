import { computeHash, emit, log as sysLog } from '@jsxcad/sys';

export const log = (geometry, prefix = '') => {
  const text = prefix + JSON.stringify(geometry);
  const level = 'serious';
  const log = { text, level };
  const hash = computeHash(log);
  emit({ log, hash });
  sysLog({ op: 'text', text });
  console.log(text);
  return geometry;
};
