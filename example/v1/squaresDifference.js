Difference(
  union(Square(7).move(-10, 0), Square(7).move(10, 0)),
  Square(5).move(-10, 0),
  Square(5).move(10, 0)
)
  .view()
  .writePdf('tmp/squaresDifference.pdf');
