[index](../../nb/api/index.md)
### op()
Parameter|Default|Type
---|---|---
...op||Operations.

Produces a group of shapes by applying op to the incoming shape.

![Image](op.md.$2.png)

op(color('red'), material('blue'), cutFrom(offset(1)), e(1))

```JavaScript
Arc(5)
  .op(color('red'), material('blue'), cutFrom(offset(1)), e(1))
  .pack()
  .view()
  .note("op(color('red'), material('blue'), cutFrom(offset(1)), e(1))");
```
