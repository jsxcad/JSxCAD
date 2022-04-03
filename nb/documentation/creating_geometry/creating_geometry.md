# Creating Geometry
One of the core functions of JSxCAD is creating geometry and a number of primitives and helper functions are provided to make creating new geometry easier. Generally geometry primitives are provided in the form thing(x axis diameter, y axis diameter, z axis height) where the second two are optional.

---
### Arc
Create a circle or a section of a an arc

```JavaScript
const aCircle = Arc(10).view();
```

![Image](creating_geometry.md.0.png)

```JavaScript
const anElipseExtruded = Arc(10, 5, 2).view();
```

![Image](creating_geometry.md.1.png)

```JavaScript
const aCircleWithSides = Arc(10).hasSides(8).view();
```

![Image](creating_geometry.md.2.png)

---
### Box
Creates a 2D or 3D box

```JavaScript
Box(10, 10).view();
```

![Image](creating_geometry.md.3.png)

```JavaScript
Box(10, 10, 2).view();
```

![Image](creating_geometry.md.4.png)

---
### Empty
Creates a new empty geometry

```JavaScript
Empty().view();
```

![Image](creating_geometry.md.5.png)

---
### Hexagon
Creates a new hexagon

```JavaScript
Hexagon(4).view();
```

![Image](creating_geometry.md.6.png)

```JavaScript
Hexagon(6, 3, 2).view();
```

![Image](creating_geometry.md.7.png)

---
### Hershy
A built in single line font useful for adding text

```JavaScript
Hershey('Some Example Text', 20).align('xy').view();
```

![Image](creating_geometry.md.8.png)

---
### Icosahedron
Creates a new Icosahedron

```JavaScript
Icosahedron(10).view();
```

![Image](creating_geometry.md.9.png)

---
### Line
Creates a new line

```JavaScript
Line(10).view();
```

![Image](creating_geometry.md.10.png)

---
### Octagon
Creates a new Octagon

```JavaScript
Octagon(20).view();
```

![Image](creating_geometry.md.11.png)

---
### Orb
Creates a new spheroid

```JavaScript
Orb(10).hasZag(0.1).view();
```

![Image](creating_geometry.md.12.png)

```JavaScript
Orb(10, 5, 2).hasZag(0.1).view();
```

![Image](creating_geometry.md.13.png)

---
### Pentagon
Generates a pentagon

```JavaScript
Pentagon(10).view();
```

![Image](creating_geometry.md.14.png)

---
### Point
A point in 3D space

```JavaScript
Point(0, 0, 0).view();
```

![Image](creating_geometry.md.15.png)

---
### Polygon
Creates a new polygon from the input points

```JavaScript
Polygon(Point(0, 0, 0), Point(10, 0, 0), Point(10, 10, 0)).view();
```

![Image](creating_geometry.md.16.png)

```JavaScript
Polygon([0, 0, 0], [10, 0, 0], [10, 10, 0]).view();
```

![Image](creating_geometry.md.17.png)

---
### Septagon
Creates a Septagon.

```JavaScript
Septagon(10).view();
```

![Image](creating_geometry.md.18.png)

---
### Triangle
Triangle creates a new triangle.

```JavaScript
Triangle(4, 9).view();
```

![Image](creating_geometry.md.19.png)
