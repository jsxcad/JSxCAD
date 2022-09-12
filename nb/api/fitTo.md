### fitTo()
Parameter|Default|Type
---|---|---
...others||The shapes to fit

Assembles the shapes into a disjoint fit.

This is equivalent to Assembly(shape, ...others).

See: [Assembly](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/Assembly.nb), [disjoint](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/disjoint.nb), [fit](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/fit.nb).

```JavaScript
Box(10)
  .color('red')
  .fitTo(Arc(12), Arc(8), Arc(4))
  .view(1)
  .note('Box(3).fit(Arc(12), Arc(8), Arc(4)) fitted in place')
  .pack()
  .view(2)
  .note('Repacked to show the pieces.');
```

![Image](fitTo.md.0.png)

Box(3).fit(Arc(12), Arc(8), Arc(4)) fitted in place

![Image](fitTo.md.1.png)

Repacked to show the pieces.
