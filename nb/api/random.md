[index](../../nb/api/index.md)
### random()
Parameter|Default|Type
---|---|---
count|1|Number of random values to supply
seed|0|Selects which random number sequence to use
op||Selects which random number sequence to use

![Image](random.md.$2.png)

```JavaScript
Seq({ to: 9 }, (r) =>
  As(
    'flower',
    Seq({ to: 16 }, (t) =>
      random(4, t + r * 100, (a, b, c, d) =>
        Curve([1, -0.1], [10 + a, -b], [10 + c, 1 + d], [1, 0.1], 200, 'closed')
      ).rz((1 / 16) * t)
    ).fill()
  )
)
  .pack()
  .color('red')
  .view('top')
```
