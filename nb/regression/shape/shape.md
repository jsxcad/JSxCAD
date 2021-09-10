const add = Triangle(10)
  .color('red')
  .add(Box(5).color('blue'))
  .gridView(256);
![Image](shape.md.0.png)

const and = Box(5)
  .and(Arc(5))
  .gridView({ size: 800, triangles: false, outline: true, wireframe: false });
![Image](shape.md.1.png)

const addTo = Triangle(10)
  .color('red')
  .addTo(Box(5).color('blue'))
  .gridView();
![Image](shape.md.2.png)

const align = Box(5).align('x>y>').gridView();
![Image](shape.md.3.png)

const as = Box(5)
  .as('box')
  .with(Arc(4).as('arc'))
  .keep('box')
  .gridView();
const clip = Box(5)
  .color('red')
  .clip(Arc(5.8).color('blue'))
  .gridView();
![Image](shape.md.4.png)

const clipFrom = Box(5)
  .color('red')
  .clipFrom(Arc(5.8).color('blue'))
  .gridView();
![Image](shape.md.5.png)

const color = Box(5).color('green').gridView();
![Image](shape.md.6.png)

const colorsEx = Box(5)
  .color('green')
  .colors((colors, s) => {
    md`Colors are ${colors}`;
    return s;
  });
Colors are

const cut = Box(5)
  .color('red')
  .cut(Arc(6).color('blue'))
  .gridView();
![Image](shape.md.7.png)

const cutFrom = Box(5)
  .color('red')
  .cutFrom(Arc(6).color('blue'))
  .gridView();
![Image](shape.md.8.png)

const eachMethod = Assembly(Box(5), Arc(6))
  .each((leafs) => leafs[0])
  .gridView();
![Image](shape.md.9.png)

const fuse = Group(Box(5).color('red'), Arc(6).color('blue'))
  .fuse()
  .gridView();
![Image](shape.md.10.png)

const inset = Box(10).inset(0.5, 0.5).gridView();
![Image](shape.md.11.png)

const keep = Assembly(Box(10).as('a'), Arc(6).as('b'))
  .keep('a')
  .gridView();
const material = Box(10)
  .material('copper')
  .gridView();
![Image](shape.md.12.png)

const move = Box(10).move(1, 2, 3).gridView();
![Image](shape.md.13.png)

const noVoid = Assembly(Box(5), Arc(5.5).void())
  .noVoid()
  .gridView();
![Image](shape.md.14.png)

const offset = Box(5).offset(1).gridView();
![Image](shape.md.15.png)

const op = Box(5)
  .op((s) => s.color('green'))
  .gridView();
![Image](shape.md.16.png)

const orient = Line(10)
  .orient({ at: [40, 50, 0] })
  .gridView();
![Image](shape.md.17.png)

const pack = Group(...seq((n) => Arc(n), { from: 1, to: 20 }))
  .pack()
  .gridView();
![Image](shape.md.18.png)

const rotate = Box(5).rotate(45).gridView();
![Image](shape.md.19.png)

const rx = Box(1, 2, 3).rx(1/8).gridView();
![Image](shape.md.20.png)

const ry = Box(1, 2, 3).ry(1/8).gridView();
![Image](shape.md.21.png)

const rz = Box(1, 2, 3).rz(1/8).gridView();
![Image](shape.md.22.png)

const scale = Box(5).scale(1, 2).gridView();
![Image](shape.md.23.png)

const sizeEx = Box(1, 2, 3)
  .size((size, shape) => {
    md`${JSON.stringify(size)}`;
    return shape;
  });
{"length":1.0000000000000016,"width":2.000000000000003,"height":3.000000000000002,"max":[0.5000000000000006,1.000000000000001,1.500000000000001],"min":[-0.500000000000001,-1.000000000000002,-1.500000000000001],"center":[-2.220446049250313e-16,-4.440892098500626e-16,0],"radius":1.8708286933869727}

const sketch = Box(2, 2, 2)
  .color('red')
  .and(Box(1, 1, 1).sketch())
  .view();
![Image](shape.md.24.png)

const tagsEx = Box(1)
  .as('box')
  .tags((tags, shape) => {
    md`${tags}`;
    return shape;
  });
const test = Box(5, 5, 5).test().gridView();
![Image](shape.md.25.png)

const tool = Box(5).tool('laser').gridView();
![Image](shape.md.26.png)

const voidEx = Assembly(Box(5), Arc(6).void())
  .gridView();
![Image](shape.md.27.png)

const weld = Weld(Arc(6).x(-1), Arc(6).x(1), Arc(6).y(1), Arc(6).y(-1))
  .fill()
  .gridView();
const withEx = Box(5).with(Arc(6)).gridView();
![Image](shape.md.28.png)

const xEx = Box(5).x(1).gridView();
![Image](shape.md.29.png)

const yEx = Box(5).y(1).gridView();
![Image](shape.md.30.png)

const zEx = Box(5).z(1).gridView();
![Image](shape.md.31.png)
