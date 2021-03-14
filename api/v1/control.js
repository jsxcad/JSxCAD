import {
  emit,
  getControlValue,
  getModule,
  read,
  setControlValue,
} from '@jsxcad/sys';

import hashSum from 'hash-sum';

export const loadControlValues = async () => {
  for (const { label, value } of (await read(`control/${getModule()}`, {
    useCache: false,
  })) || []) {
    setControlValue(getModule(), label, value);
  }
};

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

export const control = (label, value, type, options) => {
  const control = {
    type,
    label,
    value: getControlValue(getModule(), label, value),
    options,
    path: getModule(),
  };
  const hash = hashSum(control);
  emit({ control, hash });
  return value;
};
