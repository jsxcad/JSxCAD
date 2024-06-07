[index](../../nb/api/index.md)
### grow()
Parameter|Default|Type
---|---|---
tool||shape to grow by

Generates a shape around the input by growing it with a minkowski sum with the tool.

![Image](grow.md.$2.png)

The box is grown by 5 mm in all directions.

```JavaScript
Box(5, 5, 5)
  .and(grow(Orb(5)).ghost())
  .view()
  .note('The box is grown by 5 mm in all directions.');
```

![Image](grow.md.$3.png)

The box is rounded out by 5 mm in Y.

```JavaScript
Box(5, 5, 5)
  .and(grow(ArcY(5)).ghost())
  .view()
  .note('The box is rounded out by 5 mm in Y.');
```

![Image](grow.md.$4.png)

Box(5, 5, 20).and(grow(Box(4)).ghost()) grows the box 4 mm horizontally with sharp corners.

```JavaScript
Box(5, 5, 20)
  .and(grow(Box(4)).ghost())
  .view()
  .note(
    "Box(5, 5, 20).and(grow(Box(4)).ghost()) grows the box 4 mm horizontally with sharp corners."
  );
```

![Image](grow.md.$5.png)

Arc(20).grow(Orb(1)) thickens a disc

```JavaScript
Arc(20)
  .grow(Orb(1))
  .view()
  .note("Arc(20).grow(Orb(1)) thickens a disc");
```

![Image](grow.md.$6.png)

Arc(20).points().grow(Orb(1)) grows the points of an circle into spheres

```JavaScript
Arc(20)
  .points()
  .grow(Orb(1))
  .view()
  .note("Arc(20).points().grow(Orb(1)) grows the points of an circle into spheres");
```

![Image](grow.md.$7.png)

Arc(20).outline().grow(Orb(1)) grows the rim of a circle into a tube

```JavaScript
Arc(20)
  .outline()
  .grow(Orb(1))
  .view()
  .note("Arc(20).outline().grow(Orb(1)) grows the rim of a circle into a tube");
```
