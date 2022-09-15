### fill()

Converts the shape to segments and fills them to produce surfaces.

[f](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/f.nb) is provided as shorthand.

This follows an odd-even winding rule, allowing holes to be constructed.

See: [f](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/f.nb).

```JavaScript
Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0))
  .fill()
  .view()
  .note(
    'Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0)).fill() produces a triangle.'
  );
```

![Image](fill.md.0.png)

Loop(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0)).fill() produces a triangle.

```JavaScript
Arc([4, 5], 2, 0)
  .seq({ by: 1 / 32 }, rz)
  .fill()
  .view()
  .note(
    'Arc([4, 5], 2, 0).seq({ by: 1 / 32 }, rz).fill() shows the odd-even rule.'
  );
```

![Image](fill.md.1.png)

Arc([4, 5], 2, 0).seq({ by: 1 / 32 }, rz).fill() shows the odd-even rule.
