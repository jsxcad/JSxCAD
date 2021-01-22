import { toRgbFromTags } from '@jsxcad/algorithm-color';

export const setColor = (definitions, tags = [], parameters = {}, otherwise = [0, 0, 0]) => {
  // Use supplied definition
  for (const tag of tags) {
    const data = definitions.get(tag);
    if (data) {
      if (data.rgb) {
        const [r, g, b] = data.rgb;
        const color = ((r << 16) | (g << 8) | b) >>> 0;
        parameters.color = color;
        return parameters;
      }
    }
  }
  // Fall back
  let rgb = toRgbFromTags(tags, null);
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
