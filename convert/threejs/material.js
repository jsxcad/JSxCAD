import {
  DataTexture,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
} from '@jsxcad/algorithm-threejs';

import { fromPng } from '@jsxcad/convert-png';
import { setColor } from './color.js';
import { toThreejsMaterialFromTags } from '@jsxcad/algorithm-material';

const toDataTextureFromPngUrl = async (url) => {
  const result = await fetch(url);
  const { width, height, pixels } = await fromPng(await result.arrayBuffer());
  const texture = new DataTexture(pixels, width, height);
  texture.needsUpdate = true;
  return texture;
};

// Map of url to texture promises;
const textureCache = new Map();

const loadTexture = (url) => {
  if (!textureCache.has(url)) {
    textureCache.set(
      url,
      toDataTextureFromPngUrl(url)
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
        toThreejsMaterialFromTags(['material:color'], definitions),
        parameters
      );
      parameters.emissive = parameters.color;
      return new MeshPhongMaterial(parameters);
    }
  }

  // Else, default to normal material.
  return new MeshNormalMaterial({ transparent: true, opacity: 1 });
};
