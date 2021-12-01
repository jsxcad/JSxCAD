```JavaScript
Arc(5)
  .hasAngle(45 / 360, 270 / 360)
  .gridView()
  .md(`Arc(5).angle(45/360, 270/360)`);
```

![Image](shapes.md.0.png)

Arc(5).angle(45/360, 270/360)

```JavaScript
Assembly(Box(10), Arc(8), Triangle(5))
  .pack()
  .gridView(undefined, { size: 801, triangles: false, wireframe: false })
  .md(`Assembly(Box(10), Arc(8), Triangle(5))`);
```

![Image](shapes.md.1.png)

Assembly(Box(10), Arc(8), Triangle(5))

```JavaScript
Box(5, 7, 8).view().md(`Box(5, 7, 8)`);
```

![Image](shapes.md.2.png)

Box(5, 7, 8)

```JavaScript
ChainedHull(Point(), Box(5).z(5), Arc(3).z(8))
  .view()
  .md(`ChainedHull(Point(), Box(5).z(5), Arc(3).z(8))`);
```

![Image](shapes.md.3.png)

ChainedHull(Point(), Box(5).z(5), Arc(3).z(8))

```JavaScript
Empty().view().md(`Empty()`);
```

![Image](shapes.md.4.png)

Empty()

```JavaScript
Group(Box(10), Arc(8), Triangle(5))
  .pack()
  .gridView()
  .md(`Group(Box(10), Arc(8), Triangle(5))`);
```

![Image](shapes.md.5.png)

Group(Box(10), Arc(8), Triangle(5))

```JavaScript
Hershey('Hershey', 10)
  .align('xy')
  .gridView()
  .md(`Hershey(10)('Hershey').align('xy')`);
```

![Image](shapes.md.6.png)

Hershey(10)('Hershey').align('xy')

```JavaScript
Hexagon(10).gridView().md(`Hexagon(10)`);
```

![Image](shapes.md.7.png)

Hexagon(10)

```JavaScript
Hull(Arc(5), Box(5).z(5)).view().md(`Hull(Arc(5), Box(5).z(5))`);
```

![Image](shapes.md.8.png)

Hull(Arc(5), Box(5).z(5))

```JavaScript
Icosahedron(5).view().md(`Icosahedron(5)`);
```

![Image](shapes.md.9.png)

Icosahedron(5)

```JavaScript
const torusFn = ([x, y, z]) => {
  const x2 = x * x,
    y2 = y * y,
    z2 = z * z;
  const x4 = x2 * x2,
    y4 = y2 * y2,
    z4 = z2 * z2;
  return (
    x4 +
    y4 +
    z4 +
    2 * x2 * y2 +
    2 * x2 * z2 +
    2 * y2 * z2 -
    5 * x2 +
    4 * y2 -
    5 * z2 +
    4
  );
};
```

```JavaScript
Line(5, -1).rz(45).gridView().md(`Line(5, -1)`);
```

![Image](shapes.md.10.png)

Line(5, -1)

```JavaScript
Implicit(torusFn, { radius: 2 })
  .view({ withGrid: false })
  .md('Implicit(torusFn, { radius: 2 }');
```

![Image](shapes.md.11.png)

Implicit(torusFn, { radius: 2 }

```JavaScript
Octagon(5).gridView().md(`Octagon(5)`);
```

![Image](shapes.md.12.png)

Octagon(5)

```JavaScript
Orb(5).hasSides(20).view().md(`Orb(5)`);
```

![Image](shapes.md.13.png)

Orb(5)

```JavaScript
Path(Point(0), Point(5), Point(5, 5), Point(0))
  .rz(45 / 2)
  .gridView()
  .md(`Path(Point(0), Point(5), Point(5, 5), Point(0)).rz(45 / 2)`);
```

![Image](shapes.md.14.png)

Path(Point(0), Point(5), Point(5, 5), Point(0)).rz(45 / 2)

```JavaScript
Pentagon(5).gridView().md(`Pentagon(5)`);
```

![Image](shapes.md.15.png)

Pentagon(5)

```JavaScript
Point(0.5, 0.5).gridView().md(`Point(0.5, 0.5)`);
```

![Image](shapes.md.16.png)

Point(0.5, 0.5)

```JavaScript
Points([0.5, 0.5], [-0.5, -0.5])
  .gridView()
  .md(`Points([0.5, 0.5], [-0.5, -0.5])`);
```

![Image](shapes.md.17.png)

Points([0.5, 0.5], [-0.5, -0.5])

```JavaScript
Polygon(Point(0), Point(5), Point(5, 5))
  .rz(1 / 16)
  .gridView()
  .md(`Polygon(Point(0), Point(5), Point(5, 5)).rz(1 / 16)`);
```

![Image](shapes.md.18.png)

Polygon(Point(0), Point(5), Point(5, 5)).rz(1 / 16)

```JavaScript
Polyhedron(
  [
    [10, 10, 0],
    [10, -10, 0],
    [-10, -10, 0],
    [-10, 10, 0],
    [0, 0, 10],
  ],
  [
    [4, 1, 0],
    [4, 2, 1],
    [4, 3, 2],
    [4, 0, 3],
    [3, 0, 1],
    [3, 1, 2],
  ]
)
  .view()
  .md(
    `Polyhedron(  
      [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],  
      [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]])`
  );
```

![Image](shapes.md.19.png)

Polyhedron(  
      [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],  
      [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]])

```JavaScript
Septagon(5).gridView().md(`Septagon(5)`);
```

![Image](shapes.md.20.png)

Septagon(5)

```JavaScript
Spiral().gridView().md(`Spiral()`);
```

![Image](shapes.md.21.png)

Spiral()

```JavaScript
Tetragon(5).gridView().md(`Tetragon(5)`);
```

![Image](shapes.md.22.png)

Tetragon(5)

```JavaScript
Triangle(5).gridView().md(`Triangle(5)`);
```

![Image](shapes.md.23.png)

Triangle(5)

```JavaScript
Wave((a) => [[0, sin(a * 3) * 100]], { to: 360 })
  .align('xy')
  .gridView()
  .md(`Wave((a) => [[0, sin(a * 3) * 100]], { to: 360 })`);
```

![Image](shapes.md.24.png)

Wave((a) => [[0, sin(a * 3) * 100]], { to: 360 })

```JavaScript
Weld(Arc(4).x(-1), Box(5).x(1))
  .fill()
  .gridView()
  .md(`Weld(Arc(5).x(-1), Box(5).x(1)).fill()`);
```

![Image](shapes.md.25.png)

Weld(Arc(5).x(-1), Box(5).x(1)).fill()

```JavaScript
Box(1).color('red').as('box').x(5).y(5).fit(Arc(10)).to(g('box')).gridView().md('Reposition to the local frame of reference of an item');
```

![Image](shapes.md.26.png)

Reposition to the local frame of reference of an item
