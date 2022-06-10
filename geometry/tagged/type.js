import { rewrite } from './visit.js';

const rewriteType = (op) => (geometry) =>
  rewrite(geometry, (geometry, descend) => descend(op(geometry)));

const addType = (type) => (geometry) => {
  if (geometry.tags.includes(type)) {
    return undefined;
  } else {
    return { tags: [...geometry.tags, type] };
  }
};

const removeType = (type) => (geometry) => {
  if (geometry.tags.includes(type)) {
    return { tags: geometry.tags.filter((tag) => tag !== type) };
  } else {
    return undefined;
  }
};

export const hasNotType = (type) => rewriteType(removeType(type));
export const hasType = (type) => rewriteType(addType(type));
export const isNotType =
  (type) =>
  ({ tags }) =>
    !tags.includes(type);
export const isType =
  (type) =>
  ({ tags }) =>
    tags.includes(type);

export const typeGhost = 'type:ghost';
export const hasNotTypeGhost = hasNotType(typeGhost);
export const hasTypeGhost = hasType(typeGhost);
export const isNotTypeGhost = isNotType(typeGhost);
export const isTypeGhost = isType(typeGhost);

export const typeMasked = 'type:masked';
export const hasNotTypeMasked = hasNotType(typeMasked);
export const hasTypeMasked = hasType(typeMasked);
export const isNotTypeMasked = isNotType(typeMasked);
export const isTypeMasked = isType(typeMasked);

export const typeVoid = 'type:void';
export const hasNotTypeVoid = hasNotType(typeVoid);
export const hasTypeVoid = hasType(typeVoid);
export const isNotTypeVoid = isNotType(typeVoid);
export const isTypeVoid = isType(typeVoid);

export const typeWire = 'type:wire';
export const hasNotTypeWire = hasNotType(typeWire);
export const hasTypeWire = hasType(typeWire);
export const isNotTypeWire = isNotType(typeWire);
export const isTypeWire = isType(typeWire);
