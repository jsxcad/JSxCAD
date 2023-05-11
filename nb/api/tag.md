[index](../../nb/api/index.md)
### tag()
Parameter|Default|Type
---|---|---
...tags||Strings naming the tags to add.

Tags are strings associated with leaf geometry.

Qualified tags are prefixed with a namespace and a colon.

e.g., 'user:foo'.

Unqualified tags have no colon, e.g., 'foo', and are implicitly in the 'user' namespace.

Namespace|Notes
---|---
user|User defined tags.
item|Item identifiers.
part|Part identifiers.
color|Colors.
material|Materials.

See: [tags](../../nb/api/tags.nb), [get](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/get.nb), [color](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/color.nb), [material](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/material.nb), [item](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/item.nb), [part](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/part.md).

tags: user:a,user:b,user:c

Box().tag('a', 'b', 'c').tags()

```JavaScript
Box().tag('a', 'b', 'c').tags().note("Box().tag('a', 'b', 'c').tags()");
```

![Image](tag.md.$3.png)

Box().tag('a').and(Triangle().tag('b')).get('user:b')

```JavaScript
Box()
  .tag('a')
  .and(Triangle().tag('b'))
  .get('user:b')
  .view()
  .note("Box().tag('a').and(Triangle().tag('b')).get('user:b')");
```

![Image](tag.md.$4.png)

Hexagon().tag('color:orange')

```JavaScript
Hexagon().tag('color:orange').view().note("Hexagon().tag('color:orange')");
```
