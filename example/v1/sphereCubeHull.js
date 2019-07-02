hull(sphere(),
     cube().move(0.5, 0.5, 3.0),
     cube().move(0.5, -1, 0))
    .writeStl('stl/sphereCubeHull.stl');
