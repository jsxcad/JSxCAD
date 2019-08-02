hull(Sphere(),
     Cube().move(0.5, 0.5, 3.0),
     Cube().move(0.5, -1, 0))
    .writeStl('stl/sphereCubeHull.stl');
