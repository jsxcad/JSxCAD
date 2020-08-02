const hanyi = loadFont({ path: './hanyi/HanyiSentyTang.ttf' });

const surface = text({ font: hanyi, curveSegments: 32 }, string);
const extrusion = surface.extrude({ height: 5 });
surface.view().writePdf({ path: 'tmp/hanyi.pdf' });
extrusion.view().writeStl({ path: 'tmp/hanyi.stl' });
