![Image](smooth.md.fused_1.png)

fused

```JavaScript
const fused = await Box(20, 20, 20)
  .move([0, 0], [3, 4, 6])
  .cut(Box(10, 10, 100))
  .fuse()
  .view(1)
  .note('fused');
```

![Image](smooth.md.remeshed_1.png)

remeshed

```JavaScript
const remeshed = await fused.remesh().view(1, 'wireframe').note('remeshed');
```
