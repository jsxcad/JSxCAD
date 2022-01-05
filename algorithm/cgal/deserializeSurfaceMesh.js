import { getCgal } from './getCgal.js';

export const deserializeSurfaceMesh = (text) => {
  try {
    const result = getCgal().DeserializeSurfaceMesh(text);
    result.provenance = 'deserialize';
    return result;
  } catch (error) {
    throw Error(error);
  }
};
