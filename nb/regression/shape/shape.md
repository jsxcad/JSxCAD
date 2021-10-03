```JavaScript
const add = Triangle(10)
  .color('red')
  .add(Box(5).color('blue'))
  .gridView();
```

![Image](shape.md.0.png)

```JavaScript
const and = Box(5)
  .and(Arc(5))
  .gridView(undefined, { size: 800, triangles: false, outline: true, wireframe: false });
```

![Image](shape.md.1.png)

```JavaScript
const addTo = Triangle(10)
  .color('red')
  .addTo(Box(5).color('blue'))
  .gridView();
```

![Image](shape.md.2.png)

```JavaScript
const align = Box(5).align('x>y>').gridView();
```

![Image](shape.md.3.png)

```JavaScript
const as = Box(5)
  .as('box')
  .with(Arc(4).as('arc'))
  .keep('box')
  .gridView();
```

```JavaScript
const clip = Box(5)
  .color('red')
  .clip(Arc(5.8).color('blue'))
  .gridView();
```

![Image](shape.md.4.png)

```JavaScript
const clipFrom = Box(5)
  .color('red')
  .clipFrom(Arc(5.8).color('blue'))
  .gridView();
```

![Image](shape.md.5.png)

```JavaScript
const color = Box(5).color('green').gridView();
```

![Image](shape.md.6.png)

```JavaScript
const colorsEx = Box(5)
  .color('green')
  .colors((colors, s) => {
    md`Colors are ${colors}`;
    return s;
  });
```

Colors are

```JavaScript
const cut = Box(5)
  .color('red')
  .cut(Arc(6).color('blue'))
  .gridView();
```

![Image](shape.md.7.png)

```JavaScript
const cutFrom = Box(5)
  .color('red')
  .cutFrom(Arc(6).color('blue'))
  .gridView();
```

![Image](shape.md.8.png)

```JavaScript
const eachMethod = Assembly(Box(5), Arc(6))
  .each((leafs) => leafs[0])
  .gridView();
```

![Image](shape.md.9.png)

```JavaScript
const fuse = Group(Box(5).color('red'), Arc(6).color('blue'))
  .fuse()
  .gridView();
```

![Image](shape.md.10.png)

```JavaScript
const inset = Box(10).inset(0.5, 0.5).gridView();
```

![Image](shape.md.11.png)

```JavaScript
const keep = Assembly(Box(10).as('a'), Arc(6).as('b'))
  .keep('a')
  .gridView();
```

```JavaScript
const material = Box(10)
  .material('copper')
  .gridView();
```

![Image](shape.md.12.png)

```JavaScript
const move = Box(10).move(1, 2, 3).gridView();
```

![Image](shape.md.13.png)

```JavaScript
const noVoid = Assembly(Box(5), Arc(5.5).void())
  .noVoid()
  .gridView();
```

![Image](shape.md.14.png)

```JavaScript
const offsetEx = Box(5).offset(1).gridView();
```

![Image](shape.md.15.png)

```JavaScript
const op = Box(5)
  .op((s) => s.color('green'))
  .gridView();
```

![Image](shape.md.16.png)

```JavaScript
const orient = Line(10)
  .orient({ at: [40, 50, 0] })
  .gridView();
```

![Image](shape.md.17.png)

```JavaScript
const pack = Group(...seq((n) => Arc(n), { from: 1, to: 20 }))
  .pack()
  .gridView();
```

![Image](shape.md.18.png)

```JavaScript
const rotate = Box(5).rotate(45).gridView();
```

![Image](shape.md.19.png)

```JavaScript
const rx = Box(1, 2, 3).rx(1/8).gridView();
```

![Image](shape.md.20.png)

```JavaScript
const ry = Box(1, 2, 3).ry(1/8).gridView();
```

![Image](shape.md.21.png)

```JavaScript
const rz = Box(1, 2, 3).rz(1/8).gridView();
```

![Image](shape.md.22.png)

```JavaScript
const scale1 = Box(5).scale(1, 2).gridView();
```

![Image](shape.md.23.png)

```JavaScript
const scale2 = Box(5).cut(Arc(5).align('x>')).scale(1, 1).gridView();
```

![Image](shape.md.24.png)

```JavaScript
const scale3 = Box(5).cut(Arc(5).align('x>')).scale(-1, 1).gridView();
```

![Image](shape.md.25.png)

```JavaScript
const sizeEx = Box(1, 2, 3)
  .size((size, shape) => {
    md`${JSON.stringify(size)}`;
    return shape;
  });
```

{"length":1.000000000000002,"width":2.000000000000004,"height":3.000000000000002,"max":[0.500000000000001,1.000000000000002,1.500000000000001],"min":[-0.500000000000001,-1.000000000000002,-1.500000000000001],"center":[0,0,0],"radius":1.8708286933869729}

```JavaScript
const sketch = Box(2, 2, 2)
  .color('red')
  .and(Box(1, 1, 1).sketch())
  .view();
```

![Image](shape.md.26.png)

```JavaScript
const tagsEx = Box(1)
  .as('box')
  .tags((tags, shape) => {
    md`${tags}`;
    return shape;
  });
```

```JavaScript
const test = Box(5, 5, 5).test().gridView();
```

![Image](shape.md.27.png)

```JavaScript
const tool = Box(5).tool('laser').gridView();
```

![Image](shape.md.28.png)

```JavaScript
const voidEx = Assembly(Box(5), Arc(6).void())
  .gridView();
```

![Image](shape.md.29.png)

```JavaScript
const weld = Weld(Arc(6).x(-1), Arc(6).x(1), Arc(6).y(1), Arc(6).y(-1))
  .fill()
  .gridView();
```

```JavaScript
const withEx = Box(5).with(Arc(6)).gridView();
```

![Image](shape.md.30.png)

```JavaScript
const xEx = Box(5).x(1).gridView();
```

![Image](shape.md.31.png)

```JavaScript
const yEx = Box(5).y(1).gridView();
```

![Image](shape.md.32.png)

```JavaScript
const zEx = Box(5).z(1).gridView();
```

![Image](shape.md.33.png)

```JavaScript
const voidInEx = Arc(10).voidIn(offset(1)).ex(5).view();
```

![Image](shape.md.34.png)

```JavaScript
const facesEx = Box(10)
  .ex(10)
  .color('green')
  .and((s) => s.faces().n(4).extrudeAlong(normal(), 1).tint('red'))
  .view();
```

![Image](shape.md.35.png)

```JavaScript
const colorEx = Arc(10).color('blue').color('red').view();
```

![Image](shape.md.36.png)

```JavaScript
const tintEx = Arc(10).color('blue').tint('red').view();
```

![Image](shape.md.37.png)
