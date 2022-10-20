const controlValue = new Map();

export const setControlValue = (module, label, value) => {
  return controlValue.set(`${module}/${label}`, value);
};

export const getControlValue = (module, label, defaultValue) => {
  const result = controlValue.get(`${module}/${label}`);
  if (result === undefined) {
    return defaultValue;
  } else {
    return result;
  }
};
