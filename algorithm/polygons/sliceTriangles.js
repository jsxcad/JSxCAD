export const slice = ({ plane }, triangles) => {
  const edges = [];
  for (const triangle of triangles) {
    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let triangleType = 0;
    for (const point of triangle) {
      triangleType |= toType(plane, point);
    }

    switch (triangleType) {
      case COPLANAR: {
        // We could optimize this, but let's handle the general edge graph first.
        edges.push([triangle[0], triangle[1]],
                   [triangle[1], triangle[2]],
                   [triangle[2], triangle[0]]);
        break;
      }
      case FRONT: {
        break;
      }
      case BACK: {
        break;
      }
      case SPANNING: {
        let edgePoints = [];
        let startPoint = polygon[polygon.length - 1];
        let startType = toType(plane, startPoint);
        let spanStart;
        for (const endPoint of polygon) {
          const endType = toType(plane, endPoint);
          if (startType === COPLANAR && endType === COPLANAR) {
            edges.push([startPoint, endPoint]);
          } else if ((startType | endType) === SPANNING) {
            let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
            if (spanStart !== null) {
              edges.push(spanStart, lerp(t, startPoint, endPoint));
            } else {
              spanStart = lerp(t, startPoint, endPoint);
            }
          }
          startPoint = endPoint;
          startType = endType;
        }
        break;
      }
    }
  }

  return edgesToTriangles({}, edges);
}
