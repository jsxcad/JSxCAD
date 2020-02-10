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

const basic = { metalness: 0.0, roughness: 0.5, reflectivity: 0.5 };
const metal = { metalness: 0.0, roughness: 0.5, reflectivity: 0.8 };
const transparent = { opacity: 0.5, transparent: true };
const glass = { ...transparent, metalness: 0.0, clearCoat: 1, clearCoatRoughness: 0 };

const materialProperties = {
  cardboard: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/cardboard.png'
  },
  paper: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/paper.png'
  },
  wood: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/wood.png'
  },
  plastic: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/plastic.png'
  },
  leaves: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/leaves.png'
  },
  water: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/water.png'
  },
  grass: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/grass.png'
  },
  brick: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/brick.png'
  },
  circuit: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/circuit.png'
  },
  rock: {
    ...basic,
    map: 'https://jsxcad.js.org/texture/rock.png'
  },
  steel: {
    ...metal,
    map: 'https://jsxcad.js.org/texture/sheet-metal.png'
  },
  'zinc-steel': {
    ...metal,
    map: 'https://jsxcad.js.org/texture/zinc-steel.png'
  },
  thread: {
    ...metal,
    map: 'https://jsxcad.js.org/texture/thread.png'
  },
  aluminium: {
    ...metal,
    map: 'https://jsxcad.js.org/texture/aluminium.png'
  },
  brass: {
    ...metal,
    map: 'https://jsxcad.js.org/texture/brass.png'
  },
  copper: {
    ...metal,
    map: 'https://jsxcad.js.org/texture/copper.png'
  },
  glass: {
    ...glass
  },
  'wet-glass': {
    ...glass,
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
