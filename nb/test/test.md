```JavaScript
Box(20, 20, 5)
  .and(Box([10, 8], [10, 8], 5).rz(0 / 4, 1 / 4, 2 / 4, 3 / 4))
  .clip(Box(20, [0, 10], 5))
  .view();
```

![Image](test.md.0.png)
