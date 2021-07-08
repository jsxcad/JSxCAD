import {
  CanvasTexture,
  ImageBitmapLoader,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  RepeatWrapping,
  // TextureLoader,
} from 'three';

import { setColor } from './color.js';
import { toThreejsMaterialFromTags } from '@jsxcad/algorithm-material';

// Map of url to texture promises;
const textureCache = new Map();

const loadTexture = (url) => {
  if (!textureCache.has(url)) {
    textureCache.set(
      url,
      new Promise((resolve, reject) => {
        const loader = new ImageBitmapLoader();
        loader.setOptions({ imageOrientation: 'flipY' });
        loader.load(
          url,
          (imageBitmap) => {
            const texture = new CanvasTexture(imageBitmap);
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1);
            resolve(texture);
          },
          (progress) => console.log(`Loading: ${url}`),
          reject
        );
      })
    );
  }
  return textureCache.get(url);
};

const merge = async (properties, parameters) => {
  for (const key of Object.keys(properties)) {
    if (key === 'map') {
      parameters[key] = await loadTexture(properties[key]);
    } else {
      parameters[key] = properties[key];
    }
  }
};

export const setMaterial = async (definitions, tags, parameters) => {
  const threejsMaterial = toThreejsMaterialFromTags(tags, definitions);
  if (threejsMaterial !== undefined) {
    await merge(threejsMaterial, parameters);
    return threejsMaterial;
  }
};

export const buildMeshMaterial = async (definitions, tags) => {
  if (tags !== undefined) {
    const parameters = {};
    const color = setColor(definitions, tags, parameters, null);
    const material = await setMaterial(definitions, tags, parameters);
    if (material) {
      return new MeshPhysicalMaterial(parameters);
    } else if (color) {
      await merge(
        toThreejsMaterialFromTags(['material/color'], definitions),
        parameters
      );
      parameters.emissive = parameters.color;
      return new MeshPhongMaterial(parameters);
    }
  }

  // Else, default to normal material.
  return new MeshNormalMaterial();
};
