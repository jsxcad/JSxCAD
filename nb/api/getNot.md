[index](../../nb/api/index.md)
### getNot()
Parameter|Default|Type
---|---|---
|...tags||Get leafs with these tags.

Extracts the leaf geometry within shape which has none of the specified tags.

Unqualified tags are implicitly 'item' tags.

Does not find leaf geometry within items - use in() to access the interior of an item.

See: [get](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/getNot.nb), [in](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/in.nb).

![Image](getNot.md.design_1.png)

const design = Group(Box().as('box'), Arc().color('blue'), Triangle().color('blue').as('triangle')).pack().in();

```JavaScript
const design = Group(
  Box(5).as('box'),
  Arc(5).color('blue'),
  Triangle(5).color('blue').as('triangle')
)
  .pack()
  .in()
  .view(1)
  .note(
    "const design = Group(Box().as('box'), Arc().color('blue'), Triangle().color('blue').as('triangle')).pack().in();"
  );
```

![Image](getNot.md.$2.png)

design.getNot('color:blue') discards the Arc, but not the Triangle.

```JavaScript
design
  .getNot('color:blue')
  .view()
  .note("design.getNot('color:blue') discards the Arc, but not the Triangle.");
```

![Image](getNot.md.$3.png)

design.get('triangle') discards the triangle

```JavaScript
design
  .getNot('triangle')
  .view()
  .note("design.get('triangle') discards the triangle");
```

![Image](getNot.md.$4.png)

design.get(' * ') discards all items

```JavaScript
design
  .getNot('*')
  .view()
  .note("design.get(' * ') discards all items");
```
