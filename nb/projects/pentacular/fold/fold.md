![Image](fold.md.r.png)

```JavaScript
const r = await Box(20).ez([20]).unfold().clean().view();
```

![Image](fold.md.p.png)

```JavaScript
const p = await Arc({ radius: 0.5, sides: 4 }).clip(Box(0.5, 1)).view();
```

![Image](fold.md.e_4.png)

```JavaScript
const e = await r
  .on(get('unfold:edge'), (e) => p.ez([e.diameter()]))
  .color('blue')
  .view(4);
```

![Image](fold.md.$1.png)

```JavaScript
await r
  .on(get('unfold:faces'), inset(1).ez([-0.5]).color('red'))
  .view();
```

![Image](fold.md.$2_cube.png)

[cube.stl](fold.cube.stl)

```JavaScript
r.ez([-0.5]).cut(e).stl('cube');
```
