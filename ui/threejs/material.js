import { MeshNormalMaterial, MeshPhysicalMaterial, RepeatWrapping, TextureLoader } from 'three';

import { setColor } from './color';

const loader = new TextureLoader();

// FIX: Make this lazy.
const loadTexture = (url) =>
  new Promise((resolve, reject) => {
    const texture = loader.load(url, resolve);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(1, 1);
  });

const materialProperties = {
  paper: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/paper.png'
  },
  wood: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/wood.png'
  },
  plastic: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5
  },
  leaves: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/leaves.png'
  },
  water: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/water.png'
  },
  grass: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/grass.png'
  },
  brick: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/brick.png'
  },
  circuit: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/circuit.png'
  },
  rock: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: 'https://jsxcad.js.org/texture/rock.png'
  },
  'steel': {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    map: 'https://jsxcad.js.org/texture/sheet-metal.png'
  },
  copper: {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    map: 'https://jsxcad.js.org/texture/copper.png'
  },
  glass: {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    opacity: 0.5,
    transparent: true
  },
  'wet-glass': {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    opacity: 0.5,
    transparent: true,
    map: 'https://jsxcad.js.org/texture/wet-glass.png'
  }
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

export const setMaterial = async (tags, parameters) => {
  for (const tag of tags) {
    if (tag.startsWith('material/')) {
      const material = tag.substring(9);
      const properties = materialProperties[material];
      if (properties !== undefined) {
        await merge(properties, parameters);
      }
    }
  }
};

export const buildMeshMaterial = async (tags) => {
  if (tags !== undefined) {
    const parameters = {};
    setColor(tags, parameters, null);
    await setMaterial(tags, parameters);
    if (Object.keys(parameters).length > 0) {
      return new MeshPhysicalMaterial(parameters);
    }
  }

  // Else, default to normal material.
  return new MeshNormalMaterial();
};
