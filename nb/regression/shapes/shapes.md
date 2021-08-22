![Image](shapes.md.0.png)

Arc(5).angle(45/360, 270/360)

![Image](shapes.md.1.png)

Assembly(Box(10), Arc(8), Triangle(5))

![Image](shapes.md.2.png)

Box(5, 7, 8)

![Image](shapes.md.3.png)

ChainedHull(Point(), Box(5).z(5), Arc(3).z(8))

![Image](shapes.md.4.png)

Cone(6, 3)

Empty()

![Image](shapes.md.5.png)

Group(Box(10), Arc(8), Triangle(5))

![Image](shapes.md.6.png)

Hershey(10)('Hershey').align('xy')

![Image](shapes.md.7.png)

Hexagon(10)

![Image](shapes.md.8.png)

Hull(Arc(5), Box(5).z(5))

![Image](shapes.md.9.png)

Icosahedron(5)

![Image](shapes.md.10.png)

Line(5, -1)

![Image](shapes.md.11.png)

Octagon(5)

![Image](shapes.md.12.png)

Orb(5)

![Image](shapes.md.13.png)

Path(Point(0), Point(5), Point(5, 5), Point(0)).rz(45 / 2)

![Image](shapes.md.14.png)

Pentagon(5)

![Image](shapes.md.15.png)

Point(0.5, 0.5)

![Image](shapes.md.16.png)

Points([0.5, 0.5], [-0.5, -0.5])

![Image](shapes.md.17.png)

Polygon(Point(0), Point(5), Point(5, 5)).rz(1 / 16)

![Image](shapes.md.18.png)

Polyhedron(  
      [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],  
      [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]])

![Image](shapes.md.19.png)

Septagon(5)

![Image](shapes.md.20.png)

Spiral()

![Image](shapes.md.21.png)

Tetragon(5)

![Image](shapes.md.22.png)

Triangle(5)

![Image](shapes.md.23.png)

Wave((a) => [[0, sin(a * 3) * 100]], { to: 360 })

Weld(Arc(5).x(-1), Box(5).x(1)).fill()
