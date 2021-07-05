import {
  emit,
  getControlValue,
  getModule,
  hash,
  read,
  setControlValue,
} from '@jsxcad/sys';

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
  emit({ control, hash: hash(control) });
  return value;
};
