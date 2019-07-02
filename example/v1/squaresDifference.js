await difference(union(square(7).move(-10, 0),
                       square(7).move(10, 0)),
                 square(5).move(-10, 0),
                 square(5).move(10, 0))
        .writePdf('tmp/squaresDifference.pdf');
