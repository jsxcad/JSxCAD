import * as THREE from 'three';

import { setColor } from './color';

const materialProperties = {
  paper: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5
  },
  wood: {
    roughness: 0.5,
    metalness: 0.0,
    reflectivity: 0.5
  },
  metal: {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0
  },
  glass: {
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.9,
    clearCoat: 1,
    clearCoatRoughness: 0,
    opacity: 0.5,
    transparent: true
  }
};

const merge = (properties, parameters) => {
  for (const key of Object.keys(properties)) {
    parameters[key] = properties[key];
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
