import { ColladaLoader } from '@jsxcad/algorithm-threejs';

export const fromColladaToThreejs = async (input) => {
  const text = new TextDecoder('utf8').decode(input);
  const loader = new ColladaLoader();
  const { scene } = loader.parse(text);
  return scene;
};
