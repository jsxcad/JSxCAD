export const hasNotType = (geometry, type) =>
  isNotType(geometry, type)
    ? geometry
    : { ...geometry, tags: geometry.tags.filter((tag) => tag !== type) };
export const hasType = (geometry, type) =>
  isType(geometry, type)
    ? geometry
    : { ...geometry, tags: [...geometry.tags, type] };
export const isNotType = ({ tags }, type) => !tags.includes(type);
export const isType = ({ tags }, type) => tags.includes(type);

export const typeVoid = 'type:void';
export const hasNotTypeVoid = (geometry) => hasNotType(geometry, typeVoid);
export const hasTypeVoid = (geometry) => hasType(geometry, typeVoid);
export const isNotTypeVoid = (geometry) => isNotType(geometry, typeVoid);
export const isTypeVoid = (geometry) => isType(geometry, typeVoid);

export const typeWire = 'type:wire';
export const hasNotTypeWire = (geometry) => hasNotType(geometry, typeWire);
export const hasTypeWire = (geometry) => hasType(geometry, typeWire);
export const isNotTypeWire = (geometry) => isNotType(geometry, typeWire);
export const isTypeWire = (geometry) => isType(geometry, typeWire);
