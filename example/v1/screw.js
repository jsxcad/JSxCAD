union(Circle(10), Circle(5).move(10))
  .extrude({ height: 16, steps: 16, twist: 360 / 16 })
  .writeStl('screw.stl');
