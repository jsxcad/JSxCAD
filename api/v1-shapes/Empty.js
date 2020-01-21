import Shape from '@jsxcad/api-v1-shape';

export const Empty = (...shapes) => Shape.fromGeometry({ layers: [] });

export default Empty;
