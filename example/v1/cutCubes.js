import '@jsxcad/api-v1-pdf';

Box(30)
  .add(Box(30).move(5, 5), Box(30).move(-5, -5))
  .section()
  .item()
  .Page()
  .view()
  .writePdf('cutCubes');
