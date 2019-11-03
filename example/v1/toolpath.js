const shape = difference(Triangle(25), Triangle(20))
const toolpath = shape.toolpath(0.1);

const design =
  assemble(
      shape
        .color('cyan')
        .withOutline(),
      toolpath
        .color('green'),
      toolpath
        .sweep(Circle(0.1))
        .color('yellow'));

await design.writePdf('triangle_toolpath.pdf');
await toolpath.writeGcode('triangle_toolpath.gcode');

//An example of over-cutting corners in two dimensions
const shapeTwo    = difference(Square(200),Square(100))
const toolpathTwo = shapeTwo.toolpath(6.35, true, true)
const cutAwayArea = toolpathTwo.sweep(Circle(6.35));
const cutShape    = difference(shapeTwo, cutAwayArea)

await cutShape.writePdf('overcut_corners_shape.pdf');

//An example of over-cutting corners in three dimensions
const shape3D = difference(Square(200,200), Square(50,50).translate(0,75,0)).extrude(10);
const cutAwayVolume = shape3D.section().toolpath(6.35, true, true).sweep(Circle(6.35)).extrude(10);
const cutShape3d = difference(shape3D, cutAwayVolume);

await cutShape3d.writeStl('cutShape.stl');
