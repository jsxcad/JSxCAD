const outside = Triangle({ diameter: 64 });
const inside = Triangle({ diameter: 60 });
const perimeter = difference(outside, inside);

await inside.extrude({ height: 1 }).writeStl('stl/mold_inside.stl');
await perimeter.extrude({ height: 6 }).writeStl('stl/mold_perimeter.stl');
