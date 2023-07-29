[index](../../nb/api/index.md)
### Ref()
Parameter|Default|Type
---|---|---
...coordinate|[0, 0, 0]|Coordinates of the reference point.

Constructs a reference point.

![Image](Ref.md.$2.png)

Ref(1, 2, 3).and((s) => Edge(Point(0, 0, 0), Point(1, 2, 3))) shows a reference point.

```JavaScript
Ref()
  .move(1, 2, 3)
  .and((s) => Edge(Point(0, 0, 0), Point(1, 2, 3)))
  .view()
  .note(
    'Ref(1, 2, 3).and((s) => Edge(Point(0, 0, 0), Point(1, 2, 3))) shows a reference point.'
  );
```
