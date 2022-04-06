```JavaScript
Line(15, -15)
  .seq({ from: -10, to: 11 }, y, Group)
  .clip(Arc(20).cut(Arc(10)).ez(1))
  .view();
```

![Image](test.md.0.png)
