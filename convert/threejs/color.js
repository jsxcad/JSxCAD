import { toRgbFromTags } from '@jsxcad/algorithm-color';

export const setColor = (
  definitions,
  tags = [],
  parameters = {},
  otherwise = [0, 0, 0]
) => {
  let rgb = toRgbFromTags(tags, definitions, null);
  if (rgb === null) {
    rgb = otherwise;
  }
  if (rgb === null) {
    return;
  }
  const [r, g, b] = rgb;
  const color = ((r << 16) | (g << 8) | b) >>> 0;
  parameters.color = color;
  return parameters;
};
