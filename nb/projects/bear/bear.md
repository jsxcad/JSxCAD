```JavaScript
const a = await readStl('https://jsxcad.js.org/stl/bear.stl');
```

```JavaScript
a.stl('bear');
```

![Image](bear.md.0.png)

[bear_0.stl](bear.bear_0.stl)

```JavaScript
a.section(seq({ to: 200, by: 1 }, XY, Group)).view();
```

![Image](bear.md.1.png)
