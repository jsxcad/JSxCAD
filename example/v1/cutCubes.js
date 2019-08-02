await union(Cube(30).move(0, 0, 0),
            Cube(30).move(5, 5, 0),
            Cube(30).move(-5, -5, 0))
        .section()
        .writePdf('pdf/cutCubes.pdf');
