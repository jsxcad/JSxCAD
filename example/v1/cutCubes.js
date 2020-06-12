import "@jsxcad/api-v1-pdf";

await Cube(30)
  .add(Cube(30).move(5, 5), Cube(30).move(-5, -5))
  .section()
  .Item()
  .Page()
  .writePdf("cutCubes");
