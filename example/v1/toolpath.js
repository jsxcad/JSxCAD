const shape = Triangle(25).cut(Triangle(20));
const toolpath = shape.toolpath(0.1);

const design = assemble(
  shape.color('cyan').withOutline(),
  toolpath.color('green'),
  toolpath.sweep(Circle(0.1)).color('yellow')
);

design.writePdf('triangle_toolpath.pdf');
toolpath.writeGcode('triangle_toolpath.gcode');

//An example of over-cutting corners in two dimensions
const shapeTwo = Square(200).cut(Square(100));
const toolpathTwo = shapeTwo.toolpath(6.35, true, true);
const cutAwayArea = toolpathTwo.sweep(Circle(6.35));
const cutShape = shapeTwo.cut(cutAwayArea);

cutShape.writePdf('overcut_corners_shape.pdf');

//An example of over-cutting corners in three dimensions
const shape3D = Square(200, 200)
  .cut(Square(50, 50).translate(0, 75, 0))
  .extrude(10);
const cutAwayVolume = shape3D
  .section()
  .toolpath(6.35, true, true)
  .sweep(Circle(6.35))
  .extrude(10);
const cutShape3d = shape3D.cut(cutAwayVolume);

cutShape3d.writeStl('cutShape.stl');
