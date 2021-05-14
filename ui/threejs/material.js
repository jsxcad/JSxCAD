import {
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  RepeatWrapping,
  TextureLoader,
} from 'three';

import { setColor } from './color.js';
import { toThreejsMaterialFromTags } from '@jsxcad/algorithm-material';

const loader = new TextureLoader();

// FIX: Make this lazy.
const loadTexture = (url) =>
  new Promise((resolve, reject) => {
    const texture = loader.load(url, resolve);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(1, 1);
  });

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
