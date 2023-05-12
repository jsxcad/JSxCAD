[index](../../nb/api/index.md)
### f()

Converts the shape to segments and fills them to produce surfaces.

[fill](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/f.nb) is the long version of this operator.

This follows an odd-even winding rule, allowing holes to be constructed.

See: [fill](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/fill.nb).

![Image](f.md.$2.png)

Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0)).fill() produces a triangle.

```JavaScript
Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0))
  .fill()
  .view()
  .note(
    'Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0)).fill() produces a triangle.'
  );
```

![Image](f.md.$3.png)

Arc([4, 5], 2, 0).seq({ by: 1 / 32 }, rz).fill() shows the odd-even rule.

```JavaScript
Arc([4, 5], 2, 0)
  .seq({ by: 1 / 32 }, rz)
  .fill()
  .view()
  .note(
    'Arc([4, 5], 2, 0).seq({ by: 1 / 32 }, rz).fill() shows the odd-even rule.'
  );
```
