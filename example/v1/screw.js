Circle(10)
  .add(Circle(5).move(10))
  .extrude(16, 0, { twist: 360 / 16, steps: 16 })
  .writeStl('screw.stl');
