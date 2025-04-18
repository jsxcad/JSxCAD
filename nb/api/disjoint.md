[index](../../nb/api/index.md)
### disjoint()

Attempts to make the leaf geometry of a shape disjoint, so that only one shape covers one region of space.

See: [fit](../../nb/api/fit.nb), [fitTo](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/fitTo.md)

![Image](disjoint.md.$2_1.png)

Box(10, 10, [0, -5]).and(Icosahedron(10))

![Image](disjoint.md.$2_2.png)

Repacking shows the shapes aren't disjoint yet

![Image](disjoint.md.$2_3.png)

disjoint() leaves the fitted pieces in place.

![Image](disjoint.md.$2_4.png)

By repacking the objects we can see how disjoint() has fitted them together.

```JavaScript
Box(10, 10, [0, -5])
  .and(Icosahedron(10))
  .view(1)
  .note('Box(10, 10, [0, -5]).and(Icosahedron(10))')
  .view(2, pack())
  .note("Repacking shows the shapes aren't disjoint yet")
  .disjoint()
  .view(3)
  .note('disjoint() leaves the fitted pieces in place.')
  .pack()
  .view(4)
  .note(
    'By repacking the objects we can see how disjoint() has fitted them together.'
  );
```
