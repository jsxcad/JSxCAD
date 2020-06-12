import "@jsxcad/api-v1-pdf";

await Square(10)
  .cut(Square(9))
  .move(-2, -2)
  .clip(Square(10).cut(Square(9)).move(2, 2))
  .Page()
  .writePdf("squaresIntersection");
