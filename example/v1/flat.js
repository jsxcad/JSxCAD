import '@jsxcad/api-v1-stl';

Cube(20, 20, 1)
  .rotateX(65)
  .flat()
  .to(Z(0))
  .Item()
  .Page()
  .view()
  .writeStl('flat');
