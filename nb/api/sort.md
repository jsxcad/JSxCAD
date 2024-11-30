[index](../../nb/api/index.md)
### sort()
Parameter|Default|Type
---|---|---
rank|() => 0|Maps each shape to a rank.
'ascending'|true|Uses an ascending order.
'descending'|false|Uses a descending order.

Seq({ to: 10 }, Arc).sort(area(), 'ascending').disjoint()

![Image](sort.md.$2.png)

```JavaScript
Seq({ to: 10 }, Arc)
  .sort(area(), 'min')
  .disjoint()
  .note(`Seq({ to: 10 }, Arc).sort(area(), 'ascending').disjoint()`)
  .view();
```

Seq({ to: 10 }, Arc).sort(area(), 'descending').disjoint()

![Image](sort.md.$3.png)

```JavaScript
Seq({ to: 10 }, Arc)
  .sort(area(), 'max')
  .disjoint()
  .note(`Seq({ to: 10 }, Arc).sort(area(), 'descending').disjoint()`)
  .view();
```
