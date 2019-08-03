await difference(Cube(10).right().back().above(),
                 Cube(10).right().back().above().rotateY(45).rotateX(45))
        .writeStl('stl/cubes.stl');
