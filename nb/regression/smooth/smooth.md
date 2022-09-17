```JavaScript
const fused = Box(20, 20, 20)
  .move([0, 0], [3, 4, 6])
  .cut(Box(10, 10, 100))
  .fuse()
  .view(1)
  .note('fused');
```

![Image](smooth.md.0.png)

fused

```JavaScript
const remeshed = fused.remesh().view(1, 'wireframe').note('remeshed');
```

![Image](smooth.md.1.png)

remeshed

```JavaScript
const smoothed = remeshed.smooth().view(1).note('smoothed');
```

![Image](smooth.md.2.png)

smoothed

```JavaScript
const simplified = smoothed.simplify().view(1).note('simplified');
```

![Image](smooth.md.3.png)

simplified
