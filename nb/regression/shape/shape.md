![Image](shape.md.0.png)

Triangle(10).color('red').add(Box(5).color('blue'))

![Image](shape.md.1.png)

Box(5).and(Arc(5))

![Image](shape.md.2.png)

Triangle(10).color('red').addTo(Box(5).color('blue'))

![Image](shape.md.3.png)

Box(5).align('x>y>')

Box(5).as('box').with(Arc(4).as('arc')).keep('box')

![Image](shape.md.4.png)

Box(5).color('red').clip(Arc(5.8).color('blue'))

![Image](shape.md.5.png)

Box(5).color('red').clipFrom(Arc(5.8).color('blue'))

![Image](shape.md.6.png)

Box(5).color('orange')

Colors are 

Box(5).color('green').colors((s, colors) => { md`Colors are ${colors}`; return s; })

![Image](shape.md.7.png)

Box(5).color('red').cut(Arc(6).color('blue'))

![Image](shape.md.8.png)

Box(5).color('red').cutFrom(Arc(6).color('blue'))

![Image](shape.md.9.png)

Assembly(Box(5), Arc(6)).each((leafs) => leafs[0])

![Image](shape.md.10.png)

Group(Box(5).color('red'), Arc(6).color('blue')).fuse()

![Image](shape.md.11.png)

Box(10).inset(0.5, 0.5)

Assembly(Box(10).as('a'), Arc(6).as('b')).keep('a')

![Image](shape.md.12.png)

Box(10).material('copper')

![Image](shape.md.13.png)

Box(10).move(1, 2, 3)

![Image](shape.md.14.png)

Assembly(Box(5), Arc(4).void()).noVoid()

![Image](shape.md.15.png)

Box(5).offset(1)

![Image](shape.md.16.png)

Box(5).op(s => s.color('green'))

![Image](shape.md.17.png)

Line(10).orient({ at: [40, 50]})

![Image](shape.md.18.png)

Group(...each((n) => Arc(n), { from: 1, to: 20 })).pack()