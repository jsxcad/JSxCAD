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
### Loft
2D shapes can be 'lofted' to create 3D shapes. Lofting a shape is done by taking an input shape, transforming it incrementally, then joining all of the incremental steps into a single shape.

```JavaScript
Box(10)
  .cut(Box(5))
  .loft(...seq((a) => (s) => s.scale(Math.pow(a, 3)).z(a * 10), { from: 1/128, by: 1 / 8 }))
  .view();
```

![Image](interactions_with_geometry.md.9.png)

---
### Loop
2D shapes can be 'looped' to create 3D shapes. In this example two circles are looped to create a hollow doughnut. See 'loft' for a similar behavior without the ends being joined.

TODO: In the future (a) => rz(a) can be replaced with rz.

```JavaScript
Arc(6)
  .cut(Arc(3))
  .rx(0.25)
  .x(10)
  .loop(...seq((a) => rz(a), { by: 1 / 16, upto: 1 }))
  .view();
```

![Image](interactions_with_geometry.md.10.png)

---
### Move
A shape can be moved in XYZ space using the .move(x,y,z) command.

These can also be shortened to .x(), .y(), or .z() if a movement in only one axis is needed.

Multiple offsets can be provided, which will produce one result per offset.

```JavaScript
Box(5, 5, 5).move(10, 2, 12).view();
```

![Image](interactions_with_geometry.md.11.png)

```JavaScript
Box(5, 5, 5).x(10).y(2).z(12).view();
```

![Image](interactions_with_geometry.md.12.png)

```JavaScript
Box(5).x(0, 10, 20).view();
```

![Image](interactions_with_geometry.md.13.png)

---
### Remesh
Remesh can be used to break up the segments of a shape allowing it to be distorted.
shape.remesh(4, 2) first breaks segments longer than 4 and then breaks segments longer than 2.
At each step the shape is retriangulated to preserve manifold structure.

Once a shape is remeshed it can be twisted or bent about the origin.

```JavaScript
Box(157, 20).ex(1).y(25)
  .remesh(10, 8, 4)
  .op(s => s.bend(25).and(s.outline()))
  .gridView()
  .md('A rectangle bent into a ring with a central radius of 25');
```

![Image](interactions_with_geometry.md.14.png)

A rectangle bent into a ring with a central radius of 25

---
### Rotate
A shape can be rotated about the origin using the .rx(), .ry(), and .rz() commands.
These take the number of turns as an argument .rz(1/8) would rotate the shape by 1/8th of a rotation.
Multiple turns can be provided, which will produce one result per turn.

```JavaScript
const aRectangle = Box(5, 5, 15).view();
```

![Image](interactions_with_geometry.md.15.png)

```JavaScript
Box(5)
  .x(4)
  .rz(0/8, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8)
  .view();
```

![Image](interactions_with_geometry.md.16.png)

```JavaScript
aRectangle.remesh(4, 2).view(undefined, { wireframe: true });
```

![Image](interactions_with_geometry.md.17.png)

```JavaScript
aRectangle.rz(1 / 8).view();
```

![Image](interactions_with_geometry.md.18.png)

```JavaScript
aRectangle
  .rotateY(1 / 10)
  .x(4)
  .z(-2)
  .view();
```

![Image](interactions_with_geometry.md.19.png)

---
### Scale
Scale enlarges a shape by the entered multiple. .scale(x,y,z) can be used to scale asymmetrically

```JavaScript
aRectangle.scale(2).view();
```

![Image](interactions_with_geometry.md.20.png)

---
### Section
Section takes a 2D slice of a 3D shape.

By default the slice is taken where the shape intersects the XY plane.

Section takes shapes as arguments, and will use the plane of orientation of the shape.

```JavaScript
Orb(4).section().view();
```

![Image](interactions_with_geometry.md.21.png)

```JavaScript
Orb(4).section(xy, xy.z(1), xy.z(2)).view();
```

![Image](interactions_with_geometry.md.22.png)

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

![Image](interactions_with_geometry.md.23.png)

```JavaScript
taggedAssembly.keep('A').noVoid().view();
```

![Image](interactions_with_geometry.md.24.png)

```JavaScript
taggedAssembly.drop('B').view();
```

![Image](interactions_with_geometry.md.25.png)

---
#### Selection
We can select parts of geometry based on tags using get(selector), getNot(selector), and nth(number).
Aliases g, ng, and n are also available.

Selector is in the form of 'namespace:value', with namespace defaulting to 'item'.

value may also be the wildcard *.

Selection does not traverse through item, except for the input shape.

This means that s.get('a').get('b') will find b inside a, but otherwise b would not be found.

```JavaScript
Group(
  Box(10).as('box').color('yellow').material('copper'),
  Arc(10).as('arc').color('cyan').material('brick')
)
  .view((s) => s.get('*').pack())
  .md('All items.')
  .view(get('color:green'))
  .md('All green things.')
  .view(getNot('material:copper'))
  .md('All non-copper things.');
```

![Image](interactions_with_geometry.md.26.png)

All items.

All green things.

![Image](interactions_with_geometry.md.27.png)

All non-copper things.

---
### Abstract View
We can generate an abstract view of the geometry to be displayed as a graph.

```JavaScript
Box(4).as('box').and(Arc(5).ex(10).as('bar')).abstract();
```

'''mermaid
graph LR;
  0[group<br>]
  0 --> 1;
  1[item<br>item:box]
  1 --> 2;
  2[plan<br>]
  0 --> 3;
  3[item<br>item:bar]
  3 --> 4;
  4[graph<br>]
'''

---
### Voxels
We can convert a volume into voxels at a given resolution.

```JavaScript
Box(11)
  .ex(10)
  .rx(-1 / 8)
  .op((s) => s.voxels(1).color('green').and(s.outline().sketch().color('red')))
  .view().md('Produce a voxel representation with a 1mm resolution');
```

![Image](interactions_with_geometry.md.28.png)

Produce a voxel representation with a 1mm resolution
