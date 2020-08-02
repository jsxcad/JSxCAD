import '@jsxcad/api-v1-stl';

const outside = Triangle.ofDiameter(64);
const inside = Triangle.ofDiameter(60);
const perimeter = outside.cut(inside);

inside.extrude(1).Item().Page().view().writeStl('mold_inside');
perimeter.extrude(6).Item().Page().view().writeStl('mold_perimeter');
