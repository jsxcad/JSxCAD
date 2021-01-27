import { standardToolDefinitions } from './standardToolDefinitions.js';

// FIX: Apply normalizations here.
const toTagFromName = (name) => {
  return `tool/${name}`;
};

export const toTagsFromName = (name) => [toTagFromName(name)];

export const toToolFromTags = (
  kind,
  tags = [],
  customDefinitions = {},
  otherwise = {}
) => {
  for (const tag of tags) {
    if (tag.startsWith('tool/')) {
      for (const definitions of [standardToolDefinitions, customDefinitions]) {
        const definition = definitions[tag];
        if (definition && definition[kind]) {
          return definition[kind];
        }
      }
    }
  }
  return otherwise;
};
