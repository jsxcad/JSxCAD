import '@jsxcad/api-v1-stl';

const outside = Triangle.ofDiameter(64);
const inside = Triangle.ofDiameter(60);
const perimeter = outside.cut(inside);

await inside.extrude(1).Item().Page().writeStl('mold_inside');
await perimeter.extrude(6).Item().Page().writeStl('mold_perimeter');
