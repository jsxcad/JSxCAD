![Image](shapes.md.$1.png)

Arc(5).angle(45/360, 270/360)

```JavaScript
Arc(5, { start: 45 / 360, end: 270 / 360 })
  .gridView()
  .note(`Arc(5).angle(45/360, 270/360)`);
```

![Image](shapes.md.$2.png)

Assembly(Box(10), Arc(8), Triangle(5))

```JavaScript
Assembly(Box(10), Arc(8), Triangle(5))
  .pack()
  .gridView(undefined, { size: 801, triangles: false, wireframe: false })
  .note(`Assembly(Box(10), Arc(8), Triangle(5))`);
```

![Image](shapes.md.$3.png)

Box(5, 7, 8)

```JavaScript
Box(5, 7, 8).view().note(`Box(5, 7, 8)`);
```

![Image](shapes.md.$4.png)

ChainHull(Point(), Box(5).z(5), Arc(3).z(8))

```JavaScript
ChainHull(Point(), Box(5).z(5), Arc(3).z(8))
  .view()
  .note(`ChainHull(Point(), Box(5).z(5), Arc(3).z(8))`);
```

![Image](shapes.md.$5.png)

Empty()

```JavaScript
Empty().view().note(`Empty()`);
```

![Image](shapes.md.$6.png)

Group(Box(10), Arc(8), Triangle(5))

```JavaScript
Group(Box(10), Arc(8), Triangle(5))
  .pack()
  .gridView()
  .note(`Group(Box(10), Arc(8), Triangle(5))`);
```

![Image](shapes.md.$7.png)

Hershey(10)('Hershey').align('xy')

```JavaScript
Hershey('Hershey', 10)
  .align('xy')
  .gridView()
  .note(`Hershey(10)('Hershey').align('xy')`);
```

![Image](shapes.md.$8.png)

Hexagon(10)

```JavaScript
Hexagon(10).gridView().note(`Hexagon(10)`);
```

![Image](shapes.md.$9.png)

Hull(Arc(5), Box(5).z(5))

```JavaScript
Hull(Arc(5), Box(5).z(5)).view().note(`Hull(Arc(5), Box(5).z(5))`);
```

![Image](shapes.md.$10.png)

Icosahedron(5)

```JavaScript
Icosahedron(5).view().note(`Icosahedron(5)`);
```

```JavaScript
const torusFn = (x, y, z) => {
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

![Image](shapes.md.$11.png)

Implicit(2, torusFn

```JavaScript
Implicit(2, torusFn).view({ withGrid: false }).note('Implicit(2, torusFn');
```

![Image](shapes.md.$12.png)

Line([5, -1])

```JavaScript
Line([5, -1]).rz(45).gridView().note(`Line([5, -1])`);
```

![Image](shapes.md.$13.png)

Octagon(5)

```JavaScript
Octagon(5).gridView().note(`Octagon(5)`);
```

![Image](shapes.md.$14.png)

Orb(1)

```JavaScript
Orb(1).view().note(`Orb(1)`);
```

![Image](shapes.md.$15.png)

Link(Point(0), Point(5), Point(5, 5), Point(0)).rz(45 / 2)

```JavaScript
Link(Point(0), Point(5), Point(5, 5), Point(0))
  .rz(45 / 2)
  .gridView()
  .note(`Link(Point(0), Point(5), Point(5, 5), Point(0)).rz(45 / 2)`);
```

![Image](shapes.md.$16.png)

Pentagon(5)

```JavaScript
Pentagon(5).gridView().note(`Pentagon(5)`);
```

![Image](shapes.md.$17.png)

Point(0.5, 0.5)

```JavaScript
Point(0.5, 0.5).gridView().note(`Point(0.5, 0.5)`);
```

![Image](shapes.md.$18.png)

Points([0.5, 0.5], [-0.5, -0.5])

```JavaScript
Points([0.5, 0.5], [-0.5, -0.5])
  .gridView()
  .note(`Points([0.5, 0.5], [-0.5, -0.5])`);
```

![Image](shapes.md.$19.png)

Polygon(Point(0), Point(5), Point(5, 5)).rz(1 / 16)

```JavaScript
Polygon(Point(0), Point(5), Point(5, 5))
  .rz(1 / 16)
  .gridView()
  .note(`Polygon(Point(0), Point(5), Point(5, 5)).rz(1 / 16)`);
```

![Image](shapes.md.$20.png)

Polyhedron(  
      [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],  
      [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]])

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
  .note(
    `Polyhedron(  
      [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],  
      [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]])`
  );
```

![Image](shapes.md.$21.png)

Septagon(5)

```JavaScript
Arc(5, { sides: 7 }).gridView().note(`Septagon(5)`);
```

![Image](shapes.md.$22.png)

Spiral({ to: 3, by: 1/32 })

```JavaScript
Spiral({ to: 3, by: 1/32 }).gridView().note(`Spiral({ to: 3, by: 1/32 })`);
```

![Image](shapes.md.$23.png)

Triangle(5)

```JavaScript
Triangle(5).gridView().note(`Triangle(5)`);
```

![Image](shapes.md.$24.png)

Wave((t) => Point(0, sin(t)), { to: 10, by: 1/16 })

```JavaScript
Wave((t) => Point(0, sin(t)), { to: 10, by: 1/16 })
  .align('xy')
  .gridView()
  .note(`Wave((t) => Point(0, sin(t)), { to: 10, by: 1/16 })`);
```

![Image](shapes.md.$25.png)

Group(Arc(5).x(-1), Box(5).x(1)).fill('holes')

```JavaScript
Group(Arc(4).x(-1), Box(5).x(1))
  .fill('holes')
  .gridView()
  .note(`Group(Arc(5).x(-1), Box(5).x(1)).fill('holes')`);
```

```JavaScript
const extentsA = [
  [2, 5],
  [2, 3],
  [2, 4],
];
```

```JavaScript
const extentsB = [
  [0, 1],
  [0, 5],
  [0, 5],
];
```

```JavaScript
const extentsC = [
  [-2, 2],
  [-2, 2],
  [-2, -1],
];
```

![Image](shapes.md.q.png)

Boxes and Arcs from extents

```JavaScript
const q = Group(
  ArcY(...extentsA).and(Box(...extentsA).material('glass')),
  ArcX(...extentsB).and(Box(...extentsB).material('glass')),
  ArcZ(...extentsC).and(Box(...extentsC).material('glass'))
).view().note(`Boxes and Arcs from extents`);
```

![Image](shapes.md.$26.png)

```JavaScript
Line([15, -15])
  .seq({ from: -10, upto: 11 }, y, Group)
  .clip(Arc(20).cut(Arc(10)))
  .view();
```

![Image](shapes.md.$27.png)

```JavaScript
Line([15, -15])
  .seq({ from: -10, upto: 11 }, y, Group)
  .clip(Arc(20).cut(Arc(10)).ez([1]))
  .view();
```

![Image](shapes.md.$28.png)

```JavaScript
Line([-15, 15])
  .seq({ from: -15, upto: 15 }, y, Group)
  .cut(Arc(20).cut(Arc(10)))
  .view();
```

![Image](shapes.md.$29.png)

```JavaScript
Line([-15, 15])
  .seq({ from: -15, upto: 15 }, y, Group)
  .cut(Arc(20).cut(Arc(10)).ez([1]))
  .view();
```

![Image](shapes.md.$30.png)

```JavaScript
Box(12)
  .cut(
    Arc(3)
      .y(3)
      .rz(1 / 4, 3 / 4)
  )
  .color('black')
  .fit(separate().offset(1).fuse().color('yellow'))
  .view();
```

![Image](shapes.md.$31.png)

```JavaScript
Box(12)
  .cut(
    Arc(3)
      .y(3)
      .rz(1 / 4, 3 / 4)
  )
  .color('black')
  .fit(separate('noHoles').offset(1).fuse().color('yellow'))
  .view();
```

![Image](shapes.md.$32.png)

```JavaScript
Group(Box(1), Box(1).rx(1 / 4))
  .each(e([2]))
  .view();
```

![Image](shapes.md.$33_1.png)

```JavaScript
Orb(10)
  .op(lowerEnvelope('face').ez([-1]).z(-5), upperEnvelope('face').ez([1]).z(5))
  .align('z>')
  .view(1);
```

![Image](shapes.md.$34.png)

```JavaScript
Box(10).cut(Box(5)).ez([1, -1]).section().view();
```

![Image](shapes.md.$35.png)

```JavaScript
Box(10, 10, 20)
  .cutOut(Box(20, 20, [8, 100]), noOp(), grow(Arc(2)))
  .view();
```

![Image](shapes.md.$36_3.png)

```JavaScript
Box(10, 10, 20)
  .grow(Orb(2))
  .view(3);
```

![Image](shapes.md.$37_3.png)

```JavaScript
Box(10, 10, 20)
  .seam(Box(10, 10, [6, 11]))
  .grow(Box(1))
  .view(3, rx(1 / 2).align('z>'));
```

```JavaScript
const red = Arc(2).color('red');
```

```JavaScript
const blue = Box(10).x(10).color('blue');
```

![Image](shapes.md.$38.png)

```JavaScript
blue.fitTo(red.to(blue)).view();
```

![Image](shapes.md.$39.png)

```JavaScript
red.at(blue, cut(Box([10, 20], 20))).view();
```

![Image](shapes.md.$40.png)

```JavaScript
red.by(blue).view();
```

![Image](shapes.md.$41.png)

```JavaScript
Box(5)
  .as('b')
  .and(Triangle(5).as('t'))
  .on(get('b'), rz(1 / 8))
  .view();
```

![Image](shapes.md.$42.png)

```JavaScript
Box(10).cut(Box(5, 50, 5)).view();
```

![Image](shapes.md.$43.png)

```JavaScript
Box(10).clip(Box(5, 50, 5)).view();
```

![Image](shapes.md.$44.png)

```JavaScript
Box(10).join(Box(5, 50, 5)).view();
```

![Image](shapes.md.$45.png)

```JavaScript
Box(10).and(Box(5, 50, 5)).disjoint().pack().view();
```

![Image](shapes.md.$46.png)

```JavaScript
Box(10)
  .rz(1 / 8)
  .cut(eachPoint(Arc(5).to))
  .view();
```

![Image](shapes.md.$47.png)

```JavaScript
Triangle(10)
  .cut(inset(2))
  .cut(eachPoint(Arc(1).to))
  .view();
```

![Image](shapes.md.$48.png)

```JavaScript
Triangle(10)
  .cut(inset(4))
  .rz(1 / 8)
  .cut(eachPoint(Arc(5).to))
  .view();
```

![Image](shapes.md.$49.png)

```JavaScript
Orb(6, { zag: 2 })
  .faces(face => shape => face.cut(inset(0.2)))
  .view();
```

![Image](shapes.md.$50.png)

```JavaScript
Box(10, 10, 10)
  .cut(faces(Box(4, 4, 4).to))
  .clean()
  .faces(face => shape => face.cut(inset(1)))
  .view();
```

![Image](shapes.md.$51_1.png)

```JavaScript
Box(10).cut(Triangle(11)).view(1);
```

![Image](shapes.md.$52_2.png)

```JavaScript
Box(10).cut(Triangle(11)).clean().view(2);
```

![Image](shapes.md.$53_5.png)

```JavaScript
Triangle(11).eachPoint(Arc(5).to, cut).view(5);
```

![Image](shapes.md.$54.png)

```JavaScript
Box(10, 10, [0, 3])
  .smooth(10, Box(11).cut(Box(5)).ez([1.5, 3.1]))
  .view();
```

![Image](shapes.md.$55.png)

```JavaScript
Box(5, 5, 20)
  .rx(0 / 4, 1 / 6)
  .fuse()
  .smooth(50, 1, ArcX(6, 16, 16))
  .view();
```

![Image](shapes.md.$56.png)

```JavaScript
Box(10)
  .cut(Box(5).cut(Box(3).cut(Box(1))))
  .ez([3])
  .section()
  .view();
```

![Image](shapes.md.$57.png)

```JavaScript
Curve([0, 12], [1, 12], [5, 10], [12.5 + 5, 0], [16, -12], [21, -12])
  .color('red')
  .Link(link('reverse'), sx(-1))
  .grow(Arc(1))
  .view();
```
