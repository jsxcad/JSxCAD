await assemble(Cube({ corner1: [0, 0, 0], corner2: [40, 4, 1] }),
               Cube({ corner1: [0, 1, 1], corner2: [40, 3, 2.5] }),
               Cube({ corner1: [0, 10, 0], corner2: [40, 14, 1] }),
               Cube({ corner1: [0, 10, 1], corner2: [40, 11, 2.5] }),
               Cube({ corner1: [0, 13, 1], corner2: [40, 14, 2.5] }))
        .writeStl('stl/interlock-proof-of-concept.stl');
