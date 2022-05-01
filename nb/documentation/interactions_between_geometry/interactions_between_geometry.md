---
# Interactions between geometry
JSxCAD offers a number of ways to interact two or more geometries to create new geometry. Most of these operations will work on both 2D and 3D geometry.

---
### ADD
Returns the shape extended to include the space of the added shapes.

```JavaScript
Arc(10, 10, 5).color('blue').add(Box(5, 5, 5).move(3, 0, 2).color('red')).view().md(`The result is blue since the blue shape was added to`);
```

![Image](interactions_between_geometry.md.0.png)

The result is blue since the blue shape was added to

---
### Assembly
Assembles together two or more 2D or 3D shapes to form a single one.

Shapes interact subtractively with shapes later in the arguments list meaning that no overlap is allowed in the generated assembly.

The assembled shapes can later be disassembled into their disjoint parts.

See Group as an alternative.

```JavaScript
const twoCylindersAssembled = Assembly(
  Arc(10, 10, 3).color('red'),
  Arc(10, 10, 3).color('blue').x(4)
).view();
```

![Image](interactions_between_geometry.md.1.png)

This can also be achieved with a.fit(b) and a.fitTo(b).

```JavaScript
Arc(10).fit(Box(5)).pack().view();
```

![Image](interactions_between_geometry.md.2.png)

```JavaScript
Arc(10).fitTo(Box(5)).pack().view();
```

![Image](interactions_between_geometry.md.3.png)

---
### ChainHull
Performs the hull operation sequentially on the input shapes.

```JavaScript
ChainHull(Arc(10), Box(5).move(12, 12, 0), Arc(20).x(40)).view();
```

![Image](interactions_between_geometry.md.4.png)

---
### Clip
Returns the shape limited to the space of the clipping shapes.

```JavaScript
Arc(10, 10, 5).color('blue').clip(Box(5, 5, 5).move(3, 0, 2).color('red')).view().md(`The result is blue since the blue shape was clipped`);
```

![Image](interactions_between_geometry.md.5.png)

The result is blue since the blue shape was clipped

```JavaScript
Arc(10, 10, 5).color('blue').clipFrom(Box(5, 5, 5).move(3, 0, 2).color('red')).view().md(`The result is red since the red shape was clipped from.`);
```

![Image](interactions_between_geometry.md.6.png)

The result is red since the red shape was clipped from.

---
### Cut
Returns the shape with space of the cut shapes removed.

```JavaScript
Arc(10, 10, 5).color('blue').cut(Box(5, 5, 5).move(3, 0, 2).color('red')).view().md(`The result is blue since the blue shape was cut.`);
```

![Image](interactions_between_geometry.md.7.png)

The result is blue since the blue shape was cut.

```JavaScript
Arc(10, 10, 5).cutfrom(Box(5, 5, 5).move(3, 0, 2)).view().md(`The result is red since the red shape was cut from.`);
```

![Image](interactions_between_geometry.md.8.png)

The result is red since the red shape was cut from.

---
### Group
Similar to Assembly, group joins together a number of shapes, however unlike Assembly, Group does not subtract the shapes which means they are allowed to overlap which makes Group much faster to compute than Assembly.

Group can also be done using the .and() operator.

```JavaScript
Group(Arc(10, 10, 3), Arc(10, 10, 3).x(4)).view();
```

![Image](interactions_between_geometry.md.9.png)

```JavaScript
Arc(10, 10, 3).and(Arc(10, 10, 3).x(4)).view(); //Does a group
```

![Image](interactions_between_geometry.md.10.png)

---
### Hull
Performs the hull operation on the input shapes.

```JavaScript
Hull(Arc(10), Box(5).move(12, 12, 0), Arc(20).x(40)).view();
```

![Image](interactions_between_geometry.md.11.png)

---
### Pack
Pack takes input geometry and lays it out on a sheet. Groups and Assemblies are split apart, but items are preserved.

```JavaScript
Group(Arc(10), Box(3), Box(3.5)).pack().view();
```

![Image](interactions_between_geometry.md.12.png)

```JavaScript
Group(Arc(10), Box(3), Box(3.5)).as('anItem').pack().view();
```

![Image](interactions_between_geometry.md.13.png)
