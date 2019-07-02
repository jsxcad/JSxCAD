const hanyi = loadFont({ path: './hanyi/HanyiSentyTang.ttf' });

const surface = text({ font: hanyi, curveSegments: 32 }, string);
const extrusion = surface.extrude({ height: 5 });
writePdf({ path: 'tmp/hanyi.pdf' }, surface);
writeStl({ path: 'tmp/hanyi.stl' }, extrusion);
