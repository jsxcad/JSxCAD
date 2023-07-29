![Image](test.md.$1_slices.png)

[slices.pdf](test.slices.pdf)

```JavaScript
Box(10).ez([10]).section(seq({ to: 10, by: 1 }, XY, Group))
  .pdf('slices', each(flat()).page('pack'));
```
