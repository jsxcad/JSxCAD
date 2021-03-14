const controlValue = new Map();

export const setControlValue = (module, label, value) =>
  controlValue.set(`${module}/${label}`, value);

export const getControlValue = (module, label, value) => {
  const result = controlValue.get(`${module}/${label}`);
  if (result === undefined) {
    return value;
  } else {
    return result;
  }
};
