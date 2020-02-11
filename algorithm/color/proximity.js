// From 'colour-proximity' and 'chroma-js' npm.

export const proximity = (s1, s2) => {
  const c1 = rgb2lab(...s1);
  const c2 = rgb2lab(...s2);
  return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2));
};

const labConstants = {
  // Corresponds roughly to RGB brighter/darker
  Kn: 18,

  // D65 standard referent
  Xn: 0.950470,
  Yn: 1,
  Zn: 1.088830,

  t0: 0.137931034, // 4 / 29
  t1: 0.206896552, // 6 / 29
  t2: 0.12841855, // 3 * t1 * t1
  t3: 0.008856452 // t1 * t1 * t1
};

const rgbXyz = (r) => {
  if ((r /= 255) <= 0.04045) {
    return r / 12.92;
  }
  return Math.pow((r + 0.055) / 1.055, 2.4);
};

const xyzLab = function (t) {
  if (t > labConstants.t3) {
    return Math.pow(t, 1 / 3);
  }
  return t / labConstants.t2 + labConstants.t0;
};

const rgb2xyz = (r, g, b) => {
  r = rgbXyz(r);
  g = rgbXyz(g);
  b = rgbXyz(b);
  var x = xyzLab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
  var y = xyzLab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
  var z = xyzLab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
  return [x, y, z];
};

const rgb2lab = (r, g, b) => {
  const [x, y, z] = rgb2xyz(r, g, b);
  const l = 116 * y - 16;
  return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
};
