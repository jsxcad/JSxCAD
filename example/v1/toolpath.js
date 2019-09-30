const shape = difference(Triangle(25), Triangle(20))
const toolpath = shape.toolpath(0.1);

const design =
  assemble(
      shape
        .color('cyan')
        .withOutline(),
      toolpath
        .color('green'),
      Circle(0.1)
        .sweep(toolpath)
        .color('yellow'));

await design.writePdf('triangle_toolpath.pdf');
await toolpath.writeGcode('triangle_toolpath.gcode');
