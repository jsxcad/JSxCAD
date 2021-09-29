# Interactions with Geometry
JSxCAD provides a number of functions to modify existing geometry.

---
### Color
Geometry can be given a color

```JavaScript
Box(10, 10, 10).color('pink').view();
```

![Image](interactions_with_geometry.md.0.png)

---
### Extrude
2D shapes can be 'extruded' to create 3D shapes. This can be abbreviated to .ex() for brevity.

A series of extends can be provided, these will be sorted and paired. Zero will be added if the number of extents is odd.

e.g., s.ex(1, 2, 3, 4) will produce two extrusions -- one from 1z to 2z, and one from 3z to 4z.

```JavaScript
Arc(10).view();
```

![Image](interactions_with_geometry.md.1.png)

```JavaScript
Arc(10).extrude(5).view();
```

![Image](interactions_with_geometry.md.2.png)

```JavaScript
Arc(10).ex(1, 2, -1, -2).view();
```

![Image](interactions_with_geometry.md.3.png)

---
### Cast
3D shapes can be 'cast' as shadows to create 2D shapes.

A plane (default [0, 0, 1, 0]) to cast upon and a direction (default [0, 0, 1, 0]) can be provided.

```JavaScript
Arc(4)
  .ex(10)
  .rx(1 / 8)
  .material('glass')
  .and(cast())
  .view();
```

![Image](interactions_with_geometry.md.4.png)

---
### Item
Geometry can be formed into an 'item'.

An item has an exterior (which looks like an individual piece of geometry), and an interior (which may contain many distinct pieces of geometry).

The interior has its own frame of reference independent of any transformation of the exterior of the item.

Since an item appears individual from the outside, tag and path selectors need to explicitly select item to access the interior.

```JavaScript
const aBolt = Arc(8, 8, 2)
  .and(Arc(4, 4, 14).z(-7))
  .color('brown')
  .as('bolt')
  .view();
```

![Image](interactions_with_geometry.md.5.png)

```JavaScript
const aBox = Box(10, 10, 10).as('box');
```

```JavaScript
const aDesign = aBox.fit(aBolt.z(10)).as('design').view();
```

![Image](interactions_with_geometry.md.6.png)

---
### Grow
Expands the shape outwards by the input distance. May result in self intersections if not used cautiously.

```JavaScript
aDesign.get('*').pack().view().md(`We need to get into the design in order to get at 'box' and 'bolt'`);
```

![Image](interactions_with_geometry.md.7.png)

We need to get into the design in order to get at 'box' and 'bolt'

```JavaScript
Arc(10, 10, 5).grow(1).view();
```

![Image](interactions_with_geometry.md.8.png)

---
### Move
A shape can be moved in XYZ space using the .move(x,y,z) command.

These can also be shortened to .x(), .y(), or .z() if a movement in only one axis is needed.

Multiple offsets can be provided, which will produce one result per offset.

```JavaScript
Box(5, 5, 5).move(10, 2, 12).view();
```

![Image](interactions_with_geometry.md.9.png)

```JavaScript
Box(5, 5, 5).x(10).y(2).z(12).view();
```

![Image](interactions_with_geometry.md.10.png)

```JavaScript
Box(5).x(0, 10, 20).view();
```

![Image](interactions_with_geometry.md.11.png)

---
### Remesh
Remesh can be used to break up the segments of a shape allowing it to be distorted.
shape.remesh(4, 2) first breaks segments longer than 4 and then breaks segments longer than 2.
At each step the shape is retriangulated to preserve manifold structure.

```JavaScript
const aRectangle = Box(5, 5, 15).view();
```

![Image](interactions_with_geometry.md.12.png)

```JavaScript
aRectangle.remesh(4, 2).view({ wireframe: true });
```

![Image](interactions_with_geometry.md.13.png)

Once a shape is remeshed it can be twisted or bent about the origin.

```JavaScript
aRectangle.remesh(4, 1).twist(10).view({ wireframe: true });
```

![Image](interactions_with_geometry.md.14.png)

```JavaScript
aRectangle
  .ry(1 / 4)
  .remesh(4, 1)
  .y(10)
  .bend(4)
  .view({ wireframe: true });
```

![Image](interactions_with_geometry.md.15.png)

---
### Rotate
A shape can be rotated about the origin using the .rx(), .ry(), and .rz() commands.
These take the number of turns as an argument .rz(1/8) would rotate the shape by 1/8th of a rotation.
Multiple turns can be provided, which will produce one result per turn.

```JavaScript
aRectangle.rz(1 / 8).view();
```

![Image](interactions_with_geometry.md.16.png)

```JavaScript
aRectangle
  .rotateY(1 / 10)
  .x(4)
  .z(-2)
  .view();
```

![Image](interactions_with_geometry.md.17.png)

```JavaScript
Box(5)
  .x(4)
  .rz(0/8, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8)
  .view();
```

![Image](interactions_with_geometry.md.18.png)

---
### Scale
Scale enlarges a shape by the entered multiple.

```JavaScript
aRectangle.scale(2).view();
```

![Image](interactions_with_geometry.md.19.png)

---
### Section
Section takes a 2D slice of a 3D shape.

By default the slice is taken where the shape intersects the XY plane.

Section takes shapes as arguments, and will use the plane of orientation of the shape.

```JavaScript
Orb(4).section().view();
```

![Image](interactions_with_geometry.md.20.png)

```JavaScript
Orb(4).section(xy, xy.z(1), xy.z(2)).view();
```

![Image](interactions_with_geometry.md.21.png)

---
### Size
Size returns the size of the shape along with it's bounding box corners.

A function can be provided to receive the dimensions along with the shape.

```JavaScript
log(aRectangle.size());
```

```JavaScript
aRectangle.size((length, s) => s.x(length)).md(`Move the shape along by its length`);
```

Move the shape along by its length

---
### Tags
Tags lists all of the tags associated with a shape.

A function can be supplied to receive the tags and shape.

```JavaScript
log(aRectangle.tag('tagString').tags());
```

```JavaScript
aRectangle.tag('tagString').tags((tags, s) => s.md(`Tags ${tags}`));
```

Tags can be used to selectively keep or remove parts of geometry.

```JavaScript
const taggedAssembly = Assembly(
  Arc(10, 10, 2).color('blue').tag('A'),
  Box(6, 5, 2).move(2, 1, 1).color('red').tag('B')
).view();
```

![Image](interactions_with_geometry.md.22.png)

```JavaScript
taggedAssembly.keep('A').noVoid().view();
```

![Image](interactions_with_geometry.md.23.png)

```JavaScript
taggedAssembly.drop('B').view();
```

![Image](interactions_with_geometry.md.24.png)
