```JavaScript
Line(-15, 15)
  .seq({ from: -15, to: 15 }, y, Group)
  .cut(Arc(20).cut(Arc(10)).ez(1))
  .view();
```

![Image](test.md.0.png)
