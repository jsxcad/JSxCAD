# shape.bom(op)

Extracts a Bill of Materials from the parts in shape.

See: [asPart](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/asPart.nb)

```JavaScript
Box(3)
  .asPart('lid')
  .and(z(1).rz(1 / 5), Triangle(3).z(2).asPart('base'))
  .view()
  .bom();
```

![Image](bom.md.0.png)

Materials: lid, lid, base
