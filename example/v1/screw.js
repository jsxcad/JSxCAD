union(Circle(10), Circle(5).move(10))
  .extrudeWithTwist(360 / 16, { steps: 16, height: 16 })
  .writeStl('screw.stl');
