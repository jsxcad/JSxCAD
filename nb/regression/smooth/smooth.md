```JavaScript
const fused = Box(20, 20, 20)
  .move([0, 0], [3, 4, 6])
  .cut(Box(10, 10, 100))
  .fuse()
  .view(1)
  .md('fused');
```

![Image](smooth.md.0.png)

fused

```JavaScript
const remeshed = fused
  .remesh({ method: 'isotropic', lengths: [10, 5, 2, 1] })
  .view(1, { wireframe: true })
  .md('remeshed');
```

![Image](smooth.md.1.png)

remeshed

```JavaScript
const smoothed = remeshed
  .smooth({ method: 'shape', iterations: 3 })
  .view(1)
  .md('smoothed');
```

![Image](smooth.md.2.png)

smoothed

```JavaScript
const simplified = smoothed
  .simplify({ method: 'approximate' })
  .view(1)
  .md('simplified');
```

![Image](smooth.md.3.png)

simplified
