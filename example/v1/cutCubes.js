import '@jsxcad/api-v1-pdf';

Cube(30)
  .add(Cube(30).move(5, 5), Cube(30).move(-5, -5))
  .section()
  .Item()
  .Page()
  .view()
  .writePdf('cutCubes');
