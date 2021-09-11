---
# Tags

Geometry carries qualified tags which can be used for selection and in display.

The fundamental operations are Shape.tag(...tags) and Shape.untag(...).

Tags are qualified with namespaces, such as user:, color:, material:, part:, etc.

The default namespace is 'user'.

A wildcard tag is reserved and used to match any tag within a namespace.

Arc(5).tag('ring', 'color:blue').view();

![Image](tags.md.0.png)

Arc(5).tag('ring', 'color:blue', 'material:copper').untag('user:*', 'color:blue').view();

![Image](tags.md.1.png)

Shape.color() and shape.material() are provided as convenience operations.

Shape.keep() and Shape.drop() select which sub-geometries to turn void.

Arc(5).tag('a').fit(Box(4).tag('b')).keep('a').view();

![Image](tags.md.2.png)

Arc(5).tag('a').fit(Box(4).tag('b')).drop('a').view();

![Image](tags.md.3.png)
