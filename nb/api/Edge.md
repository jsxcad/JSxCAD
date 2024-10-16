[index](../../nb/api/index.md)
### Edge()
Parameter|Default|Type
---|---|---
source|[1, 1, 1]|Coordinate of the start point.
target|[0, 0, 1]|Coordinate of the end point.
normal|[1, 0, 0]|Coordinate of a normal point.

This produces an oriented segment from source coordinate to target coordinate.

The segment has a consistent local orientation along z, facing x.

See: [eachEdge](../../nb/api/eachEdge.md).

![Image](Edge.md.$2_1.png)

Box([0, 1], [0, 2], [0, 10]).to(Edge(Point(), Point(0, 6), Point(0, 0, 5))) orients a box at an edge.

```JavaScript
Box([0, 1], [0, 2], [0, 10])
  .to(Edge(Point(), Point(0, 6), Point(0, 0, 5)))
  .view(1)
  .note(
    'Box([0, 1], [0, 2], [0, 10]).to(Edge(Point(), Point(0, 6), Point(0, 0, 5))) orients a box at an edge.'
  );
```

![Image](Edge.md.$3_1.png)

Group(Edge([0, 0], [0, 1]), Edge([0, 1], [1, 1]), Edge([1, 1], [1, 0]), Edge([1, 0], [0, 0])).fill() builds a face from edges.

```JavaScript
Group(
  Edge([0, 0], [0, 1]),
  Edge([0, 1], [1, 1]),
  Edge([1, 1], [1, 0]),
  Edge([1, 0], [0, 0])
)
  .fill()
  .view(1, 'top')
  .note(
    'Group(Edge([0, 0], [0, 1]), Edge([0, 1], [1, 1]), Edge([1, 1], [1, 0]), Edge([1, 0], [0, 0])).fill() builds a face from edges.'
  );
```
