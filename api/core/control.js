import { computeHash, emit, getSourceLocation } from '@jsxcad/sys';

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

export const control = (label, defaultValue, type, options) => {
  const { path } = getSourceLocation();
  // const value = getControlValue(path, label, defaultValue);
  const value = defaultValue;
  const control = {
    type,
    label,
    value,
    options,
    path,
  };
  // console.log(`QQ/control: label=${label} get=${value} def=${defaultValue}`);
  emit({ control, hash: computeHash(control) });
  return value;
};
