import { makeNoise3D } from "open-simplex-noise";

export const Noise = (seed = 0) => {
  const generator = makeNoise3D(seed);
  const generate = (x = 0, y = 0, z = 0) => generator(x, y, z);
  return generate;
};

export default Noise;
