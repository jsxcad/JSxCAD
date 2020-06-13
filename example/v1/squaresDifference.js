await difference(
  union(Square(7).move(-10, 0), Square(7).move(10, 0)),
  Square(5).move(-10, 0),
  Square(5).move(10, 0)
).writePdf('tmp/squaresDifference.pdf');
