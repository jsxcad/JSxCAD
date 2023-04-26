```JavaScript
await Triangle(10).color('red').add(Box(5).color('blue')).gridView();
```

![Image](shape.md.$1.png)

```JavaScript
await Box(5).and(Arc(5)).view('top', 'noSkin', 'noWireframe', { size: 800 });
```

![Image](shape.md.$2_top.png)

```JavaScript
await Triangle(10).color('red').addTo(Box(5).color('blue')).gridView();
```

![Image](shape.md.$3.png)

```JavaScript
await Box(5).by(align('x>y>')).gridView();
```

![Image](shape.md.$4.png)

```JavaScript
await Box(5).as('box').fitTo(Arc(4).as('arc')).drop(getNot('box')).gridView();
```

![Image](shape.md.$5.png)

```JavaScript
await Box(5).color('red').clip(Arc(5.8).color('blue')).gridView();
```

![Image](shape.md.$6.png)

```JavaScript
await Box(5).color('red').clipFrom(Arc(5.8).color('blue')).gridView();
```

![Image](shape.md.$7.png)

```JavaScript
await Box(5).color('green').gridView();
```

![Image](shape.md.$8.png)

```JavaScript
await Box(5)
  .color('green')
  .tags('color', (colors) => note(`Colors are ${colors}`));
```

Colors are undefined

```JavaScript
await Box(5).color('red').cut(Arc(6).color('blue')).gridView();
```

![Image](shape.md.$10.png)

```JavaScript
await Box(5).color('red').cutFrom(Arc(6).color('blue')).gridView();
```

![Image](shape.md.$11.png)

```JavaScript
await Assembly(Box(5), Arc(6))
  .each((leafs) => leafs[0])
  .gridView();
```

```JavaScript
await Group(Box(5).color('red'), Arc(6).color('blue')).fuse().gridView();
```

![Image](shape.md.$13.png)

```JavaScript
await Box(10).inset(0.5, { step: 0.5 }).disjoint().n(0, 2, 4, 6, 8).gridView();
```

![Image](shape.md.$14.png)

```JavaScript
await Assembly(Box(10).as('a'), Arc(6).as('b')).drop(getNot('a')).gridView();
```

![Image](shape.md.$15.png)

```JavaScript
await Box(10).material('copper').gridView();
```

![Image](shape.md.$16.png)

```JavaScript
await Box(10).move(1, 2, 3).gridView();
```

![Image](shape.md.$17.png)

```JavaScript
await Box(10).to(Point(1, 2, 3)).gridView();
```

![Image](shape.md.$18.png)

```JavaScript
await Box(10).move(1, 2, 3).to(center()).gridView();
```

![Image](shape.md.$19.png)

```JavaScript
await Box(10, 10, 10).move(faces().sort('z>').n(0)).view();
```

![Image](shape.md.$20.png)

```JavaScript
await Assembly(Box(5), Arc(5.5).void()).noVoid().gridView();
```

![Image](shape.md.$21.png)

```JavaScript
await Box(5).offset(1).gridView();
```

![Image](shape.md.$22.png)

```JavaScript
await Box(5).op(color('green')).gridView();
```

![Image](shape.md.$23.png)

```JavaScript
await Line([10])
  .orient({ at: [40, 50, 0] })
  .gridView();
```

![Image](shape.md.$24.png)

```JavaScript
await Group(seq(Arc, { from: 1, to: 20 }))
  .pack()
  .gridView();
```

![Image](shape.md.$25.png)

```JavaScript
await Box(1, 2, 3)
  .rx(1 / 8)
  .gridView();
```

![Image](shape.md.$26.png)

```JavaScript
await Box(1, 2, 3)
  .ry(1 / 8)
  .gridView();
```

![Image](shape.md.$27.png)

```JavaScript
await Box(1, 2, 3)
  .rz(1 / 8)
  .gridView();
```

![Image](shape.md.$28.png)

```JavaScript
await Box(5).scale(1, 2).gridView();
```

![Image](shape.md.$29.png)

```JavaScript
await Box(5)
  .cut(Arc(4.9).by(align('x>')))
  .scale(1, 1)
  .gridView();
```

![Image](shape.md.$30.png)

```JavaScript
await Box(5)
  .cut(Arc(4.9).by(align('x>')))
  .scale(-1, 1)
  .gridView();
```

![Image](shape.md.$31.png)

```JavaScript
await Box(1, 2, 3).size((size) => (shape) => shape.md(`${JSON.stringify(size)}`));
```

{"length":1.0000000000000009,"width":2.0000000000000018,"height":3.0000000000000013,"max":[0.5000000000000004,1.0000000000000009,1.5000000000000007],"min":[-0.5000000000000004,-1.0000000000000009,-1.5000000000000007],"center":[0,0,0],"radius":1.8708286933869718}

```JavaScript
await Box(2, 2, 2).color('red').and(Box(1, 1, 1).sketch()).view();
```

![Image](shape.md.$33.png)

```JavaScript
await Box(1)
  .as('box')
  .tags((tags) => note(`${tags}`));
```

undefined

```JavaScript
await Box(5, 5, 5).gridView();
```

![Image](shape.md.$35.png)

```JavaScript
await Box(5).tool('laser').gridView();
```

![Image](shape.md.$36.png)

```JavaScript
await Assembly(Box(5), Arc(6).void()).gridView();
```

![Image](shape.md.$37.png)

```JavaScript
await Box(5).fitTo(Arc(6)).gridView();
```

![Image](shape.md.$38.png)

```JavaScript
await Box(5).x(1).gridView();
```

![Image](shape.md.$39.png)

```JavaScript
await Box(5).y(1).gridView();
```

![Image](shape.md.$40.png)

```JavaScript
await Box(5).z(1).gridView();
```

![Image](shape.md.$41.png)

```JavaScript
await Arc(10)
  .op((s) => s.offset(1).fitTo(s.void()))
  .ez([5])
  .view();
```

![Image](shape.md.$42.png)

```JavaScript
await Box(10)
  .ez([10])
  .color('green')
  .and(faces().n(4).extrudeAlong(normal(), [1]).tint('red'))
  .view();
```

![Image](shape.md.$43.png)

```JavaScript
await Arc(10).color('blue').color('red').view();
```

![Image](shape.md.$44.png)

```JavaScript
await Arc(10).color('blue').tint('red').view();
```

![Image](shape.md.$45.png)

```JavaScript
await Edges(
  seq(
    (y) => (s) => [Point(-10, y, 0), Point(10, y, 0)],
    {
      from: -6,
      to: 6,
      by: 1 / 4,
    },
    List
  )
)
  .rz(1 / 8)
  .clip(Arc(5).cut(Arc(2)).ez([1, -1]))
  .gridView();
```

![Image](shape.md.$46.png)

```JavaScript
const b = await Box(5)
  .ez([5])
  .and(
    Hershey('A', 3)
      .color('green')
      .z(5 / 2)
  )
  .material('glass')
  .y(10);
```

```JavaScript
await b.at(eachEdge().sort('x<y<z>').n(0).origin(), cut(Box(3, 3, 11))).view();
```

![Image](shape.md.$47.png)

```JavaScript
await b.by(eachEdge().sort('x<y<z>').n(0).origin()).cut(Box(3, 3, 11)).view();
```

![Image](shape.md.$48.png)

```JavaScript
await Voxels([0, 0, 0], [0, 0, 1], [1, 0, 1], [2, 0, 1]).view();
```

![Image](shape.md.$49.png)

```JavaScript
await Arc(2)
  .ez([5])
  .cut(
    Box(5)
      .ry(1 / 16)
      .ez([5])
      .z(3)
  )
  .simplify({ ratio: 0.1, eps: 0.01 })
  .view();
```

![Image](shape.md.$50.png)

```JavaScript
await Triangle(14).svg('triangle');
```

![Image](shape.md.$51_triangle.png)

[triangle.svg](shape.triangle.svg)

```JavaScript
await Box(10)
  .ez([50, -50])
  .rx(0, 1 / 4)
  .fuse()
  .view(0)
  .remesh(1, Box(20, 20, 20))
  .smooth({ method: 'shape', iterations: 1, time: 1 }, Box(9, 20, 20))
  .view();
```

![Image](shape.md.$52.png)

![Image](shape.md.$52.png)

```JavaScript
await Box(20, 20, 20)
  .view(1, 'wireframe')
  .md('Original mesh')
  .remesh()
  .view(2, 'wireframe')
  .md('Isotropic remeshing')
  .cut('exact', Box([0, 10], [0, -10], [0, 10]))
  .view(3, 'wireframe')
  .md('Cut')
  .demesh()
  .view(4, 'wireframe')
  .md('Cleaned mesh');
```

![Image](shape.md.$53_1.png)

Original mesh

![Image](shape.md.$53_2.png)

Isotropic remeshing

![Image](shape.md.$53_3.png)

Cut

![Image](shape.md.$53_4.png)

Cleaned mesh

```JavaScript
await Arc(4)
  .x(5)
  .seq({ by: 1 / 8 }, rz, Join)
  .material('glass')
  .color('orange')
  // .and(toolpath())
  .view();
```

![Image](shape.md.$54.png)

```JavaScript
await Box(10).cut(Arc(6).x(6, -6), Box(1, 10))
  // .and(toolpath())
  .view(54);
```

![Image](shape.md.$55_54.png)

```JavaScript
await Box(20, 20, 20)
  .join(Box(10, 10, 40))
  .rx(1 / 16)
  .material('glass')
  .and(upperEnvelope().color('red'))
  .view(60);
```

![Image](shape.md.$56_60.png)

Area of Box(2).cut(Box(1)) is function () { [native code] }

```JavaScript
await Box(2)
  .cut(Box(1))
  .area((v) => (s) => s.md(`Area is ${v.toFixed(2)}`));
```

Area is 4.00

Area of Box(2, 3, 4) is function () { [native code] }

Volume of Box(2, 3, 4) is function () { [native code] }

```JavaScript
const c = await Box(10)
  .rx(1 / 8)
  .view();
```

![Image](shape.md.c.png)

```JavaScript
await c.by(origin()).view();
```

![Image](shape.md.$61.png)

```JavaScript
await c.by(origin(), and(Box(5, 5, 5))).view();
```

![Image](shape.md.$62.png)

```JavaScript
await c.by(origin(), cut(Box(5, 5, 5))).view();
```

![Image](shape.md.$63.png)

```JavaScript
await Triangle(4)
  .x(5)
  .at(origin(), rz(1 / 16))
  .view();
```

![Image](shape.md.$64.png)

```JavaScript
await Group(Box(), Triangle(1).x(2), Hexagon(1).x(4)).sort('x<3').view();
```

![Image](shape.md.$65.png)

```JavaScript
await Group(Box(), Triangle(1).x(2), Hexagon(1).x(4)).sort('x>1').view();
```

![Image](shape.md.$66.png)

```JavaScript
await Box(5, 5, 20)
  .rx(1 / 4, 1 / 32)
  .wrap(1, 0.1)
  .view();
```

![Image](shape.md.$67.png)

```JavaScript
await Box(100).image('https://jsxcad.js.org/png/cooper_2.png').log().topView();
```

![Image](shape.md.$68.png)

```JavaScript
await Segments([
  [
    [-18.15, 40.34, 0.0],
    [-9.82, 45.66, 0.0],
  ],
  [
    [-16.91, 42.17, 0.0],
    [13.92, 44.82, 0.0],
  ],
  [
    [-7.05, 43.82, 0.0],
    [26.69, 44.17, 0.0],
  ],
  [
    [10.87, 44.37, 0.0],
    [30.95, 42.04, 0.0],
  ],
  [
    [27.14, 44.17, 0.0],
    [36.46, 33.4, 0.0],
  ],
  [
    [32.65, 36.59, 0.0],
    [41.01, 31.89, 0.0],
  ],
  [
    [37.65, 36.13, 0.0],
    [41.54, 23.4, 0.0],
  ],
  [
    [41.8, 27.95, 0.0],
    [32.31, 22.32, 0.0],
  ],
  [
    [35.45, 27.34, 0.0],
    [32.49, 19.13, 0.0],
  ],
  [
    [35.49, 22.78, 0.0],
    [26.58, 16.06, 0.0],
  ],
  [
    [30.98, 18.21, 0.0],
    [22.45, 18.34, 0.0],
  ],
  [
    [25.05, 17.89, 0.0],
    [17.39, 24.13, 0.0],
  ],
  [
    [23.35, 20.63, 0.0],
    [-27.6, 21.31, 0.0],
  ],
  [
    [-21.39, 23.32, 0.0],
    [-28.85, 17.3, 0.0],
  ],
  [
    [-24.18, 19.16, 0.0],
    [-34.62, 18.52, 0.0],
  ],
  [
    [-31.34, 17.76, 0.0],
    [-38.2, 21.91, 0.0],
  ],
  [
    [-34.61, 21.3, 0.0],
    [-46.18, 22.21, 0.0],
  ],
  [
    [-43.37, 20.97, 0.0],
    [-42.86, 35.32, 0.0],
  ],
  [
    [-44.44, 28.39, 0.0],
    [-39.27, 34.39, 0.0],
  ],
  [
    [-41.93, 32.08, 0.0],
    [-17.37, 36.51, 0.0],
  ],
  [
    [-20.62, 35.14, 0.0],
    [-17.37, 41.56, 0.0],
  ],
])
  .fill()
  .topView();
```

![Image](shape.md.$69.png)

```JavaScript
await Arc(37).cut(inset(2)).ez([2]).remesh(1).smooth(Box(50, 10, 20)).view();
```

![Image](shape.md.$70.png)

```JavaScript
await Box(4, 4, 4).cutOut(X(0)).view();
```

![Image](shape.md.$71.png)

```JavaScript
await Box(4, 4, 4).cut('open', Box(2, 2, 8)).view();
```

![Image](shape.md.$72.png)

```JavaScript
await Box(4, 4, 4).clip('open', Box(2, 2, 8)).view();
```

![Image](shape.md.$73.png)

```JavaScript
await Loft(Box(3).cut(Arc(2)), Hexagon(3).cut(Arc(2)).z(10)).view();
```

![Image](shape.md.$74.png)

```JavaScript
await Loft('open', Box(3).cut(Arc(2)), Hexagon(3).cut(Arc(2)).z(10)).view();
```

![Image](shape.md.$75.png)

```JavaScript
await Orb(5, 5, 5, { zag: 5 })
  .eachEdge((e, l) => Box([0, 0.1], [0, 0.1], [0, l * 0.75]).to)
  .view();
```

![Image](shape.md.$76.png)

```JavaScript
await Box(4).fit(Arc(6).void()).ez([1]).view();
```

![Image](shape.md.$77.png)

```JavaScript
await Box(4).fit(Arc(6).void()).ez([1], 'noVoid').view();
```

![Image](shape.md.$78.png)

```JavaScript
await Box(4).fitTo(Arc(4).void()).cut(Hexagon(3)).clean().view();
```

![Image](shape.md.$79.png)

```JavaScript
await Box(4).fitTo(Arc(4).void()).cut(Hexagon(3), 'noVoid').clean().view();
```

![Image](shape.md.$80.png)

```JavaScript
await Box(4).fitTo(Arc(3).void()).join(Box(1, 5)).clean().view();
```

![Image](shape.md.$81.png)

```JavaScript
await Box(4).fitTo(Arc(3).void()).join(Box(1, 5), 'noVoid').clean().view();
```

![Image](shape.md.$82.png)

```JavaScript
await Box(4).fitTo(Arc(3).void()).clip(Box(1, 5)).clean().view();
```

![Image](shape.md.$83.png)

```JavaScript
await Box(4).fitTo(Arc(3).void()).clip(Box(1, 5), 'noVoid').clean().view();
```

![Image](shape.md.$84.png)

```JavaScript
await Box(10, 10, 10)
  .and(
    eachEdge(
      (e, l) => (s) => Box([0, 1.5], 0, [0, l])
        .and(
          Arc([1, 2], 1, [0, l * 0.95], { start: 1 / 4, end: 3 / 4 })
            .y(1)
        )
        .to(e)
    )
  )
  .view();
```

![Image](shape.md.$85.png)

```JavaScript
await Arc(10, 10, 10, { sides: 7 })
  .cut(
    eachEdge({ selections: [Box(10, [-4, 10], [5, 10])] }, (e, l) => (s) =>
      Box(2, 2, [0, l])
        .clip(
          Arc(2, 2, [0, l], { start: 1/4, end: 3/4 })
            .grow(0.01)
        )
        .to(e)
    )
  )
  .clean()
  .view();
```

![Image](shape.md.$86.png)

```JavaScript
const xy = Box(20, 30).cut(Box(10)).to(XY());
```

```JavaScript
const xz = Arc(20, 30).cut(Pentagon(7)).to(XZ());
```

```JavaScript
const yz = Arc(20, 20).cut(Triangle(5)).to(YZ());
```

```JavaScript
Group(xy, xz, yz)
  .clean()
  .each(e(diameter()))
  .commonVolume()
  .clean()
  .and(
    xy.e(50).color('red').ghost(),
    xz.e(50).color('green').ghost(),
    yz.e(50).color('blue').ghost()
  )
  .view();
```

![Image](shape.md.$87.png)

```JavaScript
Box(20)
  .ez(2)
  .clean()
  .And(color('red'), shell([2]).color('green'))
  .clip(YZ(0))
  .view();
```

![Image](shape.md.$88.png)

```JavaScript
Box(20)
  .ez(2)
  .clean()
  .And(color('red'), shell([-1000000, 2], 'protect').color('green'))
  .clip(YZ(0))
  .view();
```

![Image](shape.md.$89.png)

```JavaScript
Box(10, 10, 10).shell().clip(YZ()).view();
```

![Image](shape.md.$90.png)

```JavaScript
Box(10, 10, 10).shell(5).clip(YZ()).view();
```

![Image](shape.md.$91.png)

```JavaScript
Box(10, 10, 10).shell(1, { approx: 1 }).clip(YZ()).view();
```

![Image](shape.md.$92.png)

```JavaScript
Box(10, 10, 10).shell(1, { approx: 0.01 }).clip(YZ()).color('green').view();
```

![Image](shape.md.$93.png)

```JavaScript
Line(20).stroke(1).view();
```

![Image](shape.md.$94.png)
