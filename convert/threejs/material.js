import * as THREE from 'three';

import { setColor } from './color';

const loader = new THREE.TextureLoader();

// FIX: Make this lazy.
const loadTexture = (url) => {
  const texture = loader.load(url);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.set( 0, 0 );
  texture.repeat.set( 1, 1 );
  return texture;
}

const materialProperties = {
  paper: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/paper.png",
  },
  wood: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/wood.png",
  },
  water: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/water.png",
  },
  grass: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/grass.png",
  },
  brick: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/brick.png",
  },
  rock: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5,
    map: "https://jsxcad.js.org/texture/rock.png",
  },
  'sheet-metal': {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    map: "https://jsxcad.js.org/texture/sheet-metal.png",
  },
  metal: {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
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
    map: "https://jsxcad.js.org/texture/wet-glass.png",
  }
};

const merge = (properties, parameters) => {
  for (const key of Object.keys(properties)) {
    if (key === 'map') {
      parameters[key] = loadTexture(properties[key]);
    } else {
      parameters[key] = properties[key];
    }
  }
};

export const setMaterial = (tags, parameters) => {
  for (const tag of tags) {
    if (tag.startsWith('material/')) {
      const material = tag.substring(9);
      const properties = materialProperties[material];
      if (properties !== undefined) {
        merge(properties, parameters);
      }
    }
  }
};

export const buildMeshMaterial = (tags) => {
  if (tags !== undefined) {
    const parameters = {};
    setColor(tags, parameters, null);
    setMaterial(tags, parameters);
    if (Object.keys(parameters).length > 0) {
      return new THREE.MeshPhysicalMaterial(parameters);
    }
  }

  // Else, default to normal material.
  return new THREE.MeshNormalMaterial();
};
