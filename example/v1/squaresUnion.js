Union(
  difference(Square(10), Square(9)).move(-2, -2),
  difference(Square(10), Square(9)).move(2, 2)
)
  .view()
  .writePdf('tmp/squaresUnion.pdf');
