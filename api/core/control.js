import {
  computeHash,
  emit,
  getControlValue,
  getSourceLocation,
} from '@jsxcad/sys';

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

export const control = (label, defaultValue, type, options) => {
  const { path } = getSourceLocation();
  const value = getControlValue(path, label, defaultValue);
  const control = {
    type,
    label,
    value,
    options,
    path,
  };
  emit({ control, hash: computeHash(control) });
  return value;
};
