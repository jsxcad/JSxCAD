### sz()
dimension|1|Dimension by which to scale along the z axis

The shape is scaled along those dimensions.

Negative dimensions are supported.

See: [scale](../../nb/api/scale.nb), [sx](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/sx.nb), [sy](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/sy.md).

```JavaScript
Box(2, 3, [0, 5]).op(ghost(), sz(-0.5)).view();
```

![Image](sz.md.0.png)
