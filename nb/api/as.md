[index](../../nb/api/index.md)
### as()
Parameter|Default|Type
---|---|---
id||The id of the item to construct.

Wraps shape in an item with the provided id.

An item acts like a single piece of geometry but may contain a complex composition.

It can be extracted using shape.get(id).

See: [get](../../nb/api/get.nb), [nth](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/nth.md).

![Image](as.md.$2_1.png)

Given Box(10).and(Arc(2, 2, [0, 2])) n(0) is the box.

![Image](as.md.$2_2.png)

as('plate') means nth(0) is the whole item.

```JavaScript
Box(10)
  .and(Arc(2, 2, [0, 2]))
  .view(1, n(0))
  .note('Given Box(10).and(Arc(2, 2, [0, 2])) n(0) is the box.')
  .as('plate')
  .view(2, n(0))
  .note("as('plate') means nth(0) is the whole item.");
```
