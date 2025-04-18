[index](../../nb/api/index.md)
### asPart()
Parameter|Default|Type
---|---|---
id||The id of the part to construct.

Constructs an item as with shape.as(id), but labels it as a part for use with a shape.bom().

See: [as](../../nb/api/as.nb), [bom](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/bom.md)

![Image](asPart.md.$2.png)

Box(3).asPart('lid').and(z(1).rz(1 / 5), Triangle(3).z(2).asPart('base')) produces these parts: , part:lid, part:lid, part:base

```JavaScript
Box(3)
  .asPart('lid')
  .and(z(1).rz(1 / 5), Triangle(3).z(2).asPart('base'))
  .view()
  .bom((...parts) =>
    note(
      `Box(3).asPart('lid').and(z(1).rz(1 / 5), Triangle(3).z(2).asPart('base')) produces these parts: ${parts.join(
        ', '
      )}`
    )
  );
```
