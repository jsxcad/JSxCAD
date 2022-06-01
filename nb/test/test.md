```JavaScript
Box(10, 3, 3)
  .remesh(1)
  .deform(
    [
      {
        selection: Box([4.8, 5], 3, 3),
        deformation: Point().rx(1 / 4),
      },
      {
        selection: Box([-5, -4.8], 3, 3),
        deformation: Point().rx(-1 / 4),
      },
      {
        selection: Box([-0.1, 0.1], 3, 3),
        deformation: Point().z(3),
      },
    ],
    {
      iterations: 1000,
      tolerance: 0.001,
      alpha: 0.05,
    }
  )
  .view(62);
```

![Image](test.md.0.png)
