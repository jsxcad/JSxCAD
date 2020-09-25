import '@jsxcad/api-v1-stl';

Box(20, 20, 1)
  .rotateX(65)
  .flat()
  .to(Z(0))
  .item()
  .Page()
  .view()
  .writeStl('flat');
