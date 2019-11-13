const outside = Triangle({ diameter: 64 });
const inside = Triangle({ diameter: 60 });
const perimeter = difference(outside, inside);

await inside.extrude(1).writeStl('stl/mold_inside.stl');
await perimeter.extrude(6).writeStl('stl/mold_perimeter.stl');
