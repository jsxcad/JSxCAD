await union(Square(30), Square(30).move(15, 15))
        .outline()
        .writePdf('pdf/squares.pdf');
