# Creating Geometry
One of the core functions of JSxCAD is creating geometry and a number of primitives and helper functions are provided to make creating new geometry easier. Generally geometry primitives are provided in the form thing(x axis diameter, y axis diameter, z axis height) where the second two are optional.

---
### Arc
Create a circle or a section of a an arc. The number of sides can be computed automatically to limit maximum deviation from the ideal circle using .hasZag(deviation).

```JavaScript
const aCircle = await Arc(10).view();
```

![Image](creating_geometry.md.aCircle.png)

```JavaScript
const anElipseExtruded = await Arc(10, 5, 2).view();
```

![Image](creating_geometry.md.anElipseExtruded.png)

```JavaScript
const aCircleWithSides = await Arc(10, { sides: 8 }).view();
```

![Image](creating_geometry.md.aCircleWithSides.png)

```JavaScript
const aCircleWithZag = await Arc(20, { zag: 0.1 }).view();
```

![Image](creating_geometry.md.aCircleWithZag.png)

---
### Box
Creates a 2D or 3D box

```JavaScript
Box(10, 10).view();
```

![Image](creating_geometry.md.$3.png)

```JavaScript
Box(10, 10, 2).view();
```

![Image](creating_geometry.md.$4.png)

---
### Curve
Create a bezier curve. The number of segments is scaled automatically to match the curvature.

```JavaScript
await Curve(Point(0, 0), Point(10, 10), Point(20, 30), Point(40, 0)).view();
```

![Image](creating_geometry.md.$6.png)

```JavaScript
await Curve([0, 0], [10, 0], [10, 10], [20, 10])
  .rx(1 / 4)
  .eachEdge(ArcX(0, 4, 4, { sides: 6 }), Loft)
  .view();
```

---
### Empty
Creates a new empty geometry

```JavaScript
Empty().view();
```

---
### Hexagon
Creates a new hexagon

```JavaScript
await Hexagon(4).view();
```

![Image](creating_geometry.md.$11.png)

```JavaScript
await Hexagon(6, 3, 2).view();
```

![Image](creating_geometry.md.$12.png)

---
### Hershy
A built in single line font useful for adding text

```JavaScript
Hershey('Some Example Text', 20).by(align('xy')).view();
```

![Image](creating_geometry.md.$14.png)

---
### Icosahedron
Creates a new Icosahedron

```JavaScript
await Icosahedron(10).view();
```

![Image](creating_geometry.md.$16.png)

---
### Line
Creates a new line

```JavaScript
await Line(10).view();
```

![Image](creating_geometry.md.$18.png)

---
### Link
Links a set of ordered points together into ordered segments.

```JavaScript
await Group(Point(0, 0), Point(10, 10), Point(20, 10)).link().view();
```

![Image](creating_geometry.md.$20.png)

```JavaScript
await Arc(10, { start: -1 / 3, end: 1 / 3 })
  .x(-3, 3)
  .link()
  .view();
```

![Image](creating_geometry.md.$21.png)

---
### Loop
Loop is very similar to link, except that the last point is connected back to the first point.

```JavaScript
await Group(Point(0, 0), Point(10, 10), Point(20, 10)).loop().view();
```

![Image](creating_geometry.md.$23.png)

---
### Octagon
Creates a new Octagon

```JavaScript
await Octagon(20).view();
```

![Image](creating_geometry.md.$25.png)

---
### Orb
Creates a new spheroid

```JavaScript
await Orb(10).view();
```

![Image](creating_geometry.md.$27.png)

```JavaScript
await Orb(10, 5, 2).view();
```

![Image](creating_geometry.md.$28.png)

---
### Pentagon
Generates a pentagon

```JavaScript
await Pentagon(10).view();
```

![Image](creating_geometry.md.$30.png)

---
### Point
A point in 3D space

```JavaScript
await Point(0, 0, 0).view();
```

![Image](creating_geometry.md.$32.png)

---
### Polygon
Creates a new polygon from the input points

```JavaScript
await Polygon(Point(0, 0, 0), Point(10, 0, 0), Point(10, 10, 0)).view();
```

![Image](creating_geometry.md.$34.png)

```JavaScript
await Polygon([0, 0, 0], [10, 0, 0], [10, 10, 0]).view();
```

![Image](creating_geometry.md.$35.png)

---
### Triangle
Triangle creates a new triangle.

```JavaScript
await Triangle(4, 9).view();
```

![Image](creating_geometry.md.$37.png)
