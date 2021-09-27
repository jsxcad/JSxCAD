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

export const typeWire = 'type:wire';
export const hasNotTypeWire = (geometry) => hasNotType(geometry, typeWire);
export const hasTypeWire = (geometry) => hasType(geometry, typeWire);
export const isNotTypeWire = (geometry) => isNotType(geometry, typeWire);
export const isTypeWire = (geometry) => isType(geometry, typeWire);
