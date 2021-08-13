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

![Image](shape.md.19.png)

Box(5).rotate(45)

![Image](shape.md.20.png)

Box(1, 2, 3).rx(1/8)

![Image](shape.md.21.png)

Box(1, 2, 3).ry(1/8)

![Image](shape.md.22.png)

Box(1, 2, 3).rz(1/8)

![Image](shape.md.23.png)

Box(5).scale(1, 2)

{"length":1.0000000000000016,"width":2.000000000000003,"height":3.000000000000002,"max":[0.5000000000000006,1.000000000000001,1.500000000000001],"min":[-0.500000000000001,-1.000000000000002,-1.500000000000001],"center":[-2.220446049250313e-16,-4.440892098500626e-16,0],"radius":1.8708286933869727}

Box(1, 2, 3).size((size, shape) => { md`${JSON.stringify(size)}`; return shape; })

![Image](shape.md.24.png)

Box(2, 2, 2).and(Box(1, 1, 1).sketch())

Box(1).as('box').tags((tags, shape) => { md`${tags}`; return shape; })

![Image](shape.md.25.png)

Box(1).test()

![Image](shape.md.26.png)

Box(5).tool('laser')

![Image](shape.md.27.png)

Assembly(Box(5), Arc(6).void())

Weld(Arc(6).x(-1), Arc(6).x(1), Arc(6).y(1), Arc(6).y(-1)).fill()

![Image](shape.md.28.png)

Box(5).with(Arc(6))

![Image](shape.md.29.png)

Box(5).x(1)

![Image](shape.md.30.png)

Box(5).y(1)

![Image](shape.md.31.png)

Box(5).z(1)