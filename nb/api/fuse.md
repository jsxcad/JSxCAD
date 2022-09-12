### fuse()

Attempts to joins all of the parts of the shape.

See: [join](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/join.nb).

```JavaScript
Box(6, 4, 2)
  .ry(seq({ by: 1 / 8 }))
  .view(1)
  .note('Box(6, 4, 2).ry(seq({ by: 1 / 8 })) arranges boxes in a group')
  .fuse()
  .view(2)
  .note('fuse() turns them into a single solid');
```

![Image](fuse.md.0.png)

Box(6, 4, 2).ry(seq({ by: 1 / 8 })) arranges boxes in a group

![Image](fuse.md.1.png)

fuse() turns them into a single solid
