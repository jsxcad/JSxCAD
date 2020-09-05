import '@jsxcad/api-v1-stl';

ChainedHull(Circle(10).moveZ(-10), Square(5), Circle(10).moveZ(10))
  .item()
  .Page()
  .view()
  .writeStl('chainHull');
