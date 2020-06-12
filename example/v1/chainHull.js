import "@jsxcad/api-v1-stl";

await ChainedHull(Circle(10).moveZ(-10), Square(5), Circle(10).moveZ(10))
  .Item()
  .Page()
  .writeStl("chainHull");
