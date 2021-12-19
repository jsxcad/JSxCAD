let config = {};

export const getConfig = () => config;

export const setConfig = (value = {}) => {
  config = value;
};
