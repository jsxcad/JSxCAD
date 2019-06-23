await union(difference(square(10), square(9)).move(-2, -2),
            difference(square(10), square(9)).move(2, 2))
        .writePdf('tmp/squaresUnion.pdf');
