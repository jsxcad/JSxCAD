import { standardMaterialDefinitions } from './standardMaterialDefinitions.js';

// FIX: Apply normalizations here.
const toTagFromName = (name) => {
  return `material:${name}`;
};

export const toTagsFromName = (name) => [toTagFromName(name)];

export const toThreejsMaterialFromTags = (
  tags = [],
  customDefinitions = {},
  otherwise
) => {
  for (const tag of tags) {
    if (tag.startsWith('image:')) {
      const map = tag.substring(6);
      return {
        reflectivity: 0.1,
        emissiveIntensity: 0.25,
        map,
      };
    } else if (tag.startsWith('material:')) {
      for (const definitions of [
        standardMaterialDefinitions,
        customDefinitions,
      ]) {
        const definition = definitions[tag];
        if (definition && definition.threejsMaterial) {
          return definition.threejsMaterial;
        }
      }
    }
  }
  return otherwise;
};
