md`
# Toolpath Examples
`;

md`
Construct a shape with obtuse and acute angles to demonstrate toolpath generation.
`;
const shape = Hexagon(20).cut(Square(10).move(15));
md`
'''
const shape = Hexagon(20).cut(Square(10).move(15));
'''
`;

md`
Show the shape with a continuous toolpath swept conservatively around the shape.
`;
shape
  .outline()
  .toolpath(1, { overcut: false, solid: true })
  .sweep(Circle(1))
  .with(shape.outline().color('red').sketch())
  .Item('Cut shape')
  .topView();

md`
Show the shape with a discontinuous toolpath swept by a 1 mm bit to cut out that shape.
`;
shape
  .outline()
  .toolpath(1)
  .sweep(Circle(1))
  .with(shape.outline().color('red').sketch())
  .Item('Cut shape')
  .topView();

md`
Show the shape with a continuous toolpath swept by a 1 mm bit to cut out that shape.
`;
shape
  .outline()
  .toolpath(1, { solid: true })
  .sweep(Circle(1))
  .with(shape.outline().color('red').sketch())
  .Item('Cut shape (continuous)')
  .topView();

md`
Show the shape with a discontinuous toolpath swept by a 1 mm bit to cut out a hole of that shape.
`;
shape
  .outline()
  .flip()
  .toolpath(1)
  .sweep(Circle(1))
  .with(shape.outline().color('red').sketch())
  .Item('Cut shape')
  .topView();

md`
Show the shape with a continuous toolpath swept by a 1 mm bit to cut out a hole of that shape.
`;
shape
  .outline()
  .flip()
  .toolpath(1, { solid: true })
  .sweep(Circle(1))
  .with(shape.outline().color('red').sketch())
  .Item('Cut shape')
  .topView();
