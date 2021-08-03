import {
  emit,
  getControlValue,
  getSourceLocation,
  hash,
  read,
  setControlValue,
} from '@jsxcad/sys';

export const loadControlValues = async () => {
  const { path } = getSourceLocation();
  for (const { label, value } of (await read(`control/${path}`, {
    useCache: false,
  })) || []) {
    setControlValue(path, label, value);
  }
};

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

export const control = (label, value, type, options) => {
  const { path } = getSourceLocation();
  const control = {
    type,
    label,
    value: getControlValue(path, label, value),
    options,
    path,
  };
  emit({ control, hash: hash(control) });
  return value;
};
