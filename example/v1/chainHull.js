await chainHull(Circle(10).move(0, 0, -10),
                Square(5),
                Circle(10).translate(0, 0, 10))
        .writeStl('stl/chainHull.stl');
