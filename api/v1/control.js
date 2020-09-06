import { emit, getCurrentPath, read } from '@jsxcad/sys';

// FIX: This needs to consider the current module.
// FIX: Needs to communicate cache invalidation with other workers.
const getControlValues = async () =>
  (await read(`control/${getCurrentPath()}`, { useCache: false })) || {};

export const stringBox = async (label, otherwise) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'stringBox', label, value } });
  return { [label]: value };
};

export const numberBox = async (label, otherwise) =>
  Number(await stringBox(label));

export const sliderBox = async (
  label,
  otherwise,
  { min = 0, max = 100, step = 1 } = {}
) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'sliderBox', label, value, min, max, step } });
  return { [label]: Number(value) };
};

export const checkBox = async (label, otherwise) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'checkBox', label, value } });
  return { [label]: Boolean(value) };
};

export const selectBox = async (label, otherwise, options) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'selectBox', label, value, options } });
  return { [label]: value };
};
