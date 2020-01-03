import '@jsxcad/api-v1-stl';

const outside = Triangle.ofDiameter(64);
const inside = Triangle.ofDiameter(60);
const perimeter = outside.cut(inside);

await inside.extrude(1).writeStl('stl/mold_inside.stl');
await perimeter.extrude(6).writeStl('stl/mold_perimeter.stl');
