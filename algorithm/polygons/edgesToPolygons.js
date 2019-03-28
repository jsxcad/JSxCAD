const toKey = JSON.stringify;

export const edgesToPolygons = ({}, edges) => {
  // Build an map of start to ends.
  let edgeMap = new Map();
  for (const [startPoint, endPoint] of edges) {
    // There's probably a better way.
    let startKey = toKey(startPoint);
    let vertex = edgeMap.get(startKey);
    if (vertex === undefined) {
      edgeMap.set(startKey, [startPoint, [toKey(endPoint)]]);
    } else {
      const [startPoint, endPoints] = vertex;
      endPoints.push(toKey(endPoint));
    }
  }

  // Collect the polygons we produce.
  const polygons = [];

  // Traverse the graph.
  for (let startKey of edgeMap.keys()) {
    let key = startKey;
    const polygon = [];
    while (true) {
      const value = edgeMap.get(key);
      const [point, next] = value;
      if (next.length == 0) {
        if (polygon.length > 0) {
          // This would form an open path.
          polygons.push([null, ...polygon]);
          // But it should be impossible for now.
          throw Error('die');
        }
        break;
      }
      polygon.push(point);
      key = next.pop();
      if (key === startKey) {
        polygons.push(polygon);
        break;
      }
    }
    if (polygon.length > 0) {
      polygons.push(polygon);
    }
  }

  // All done.
  return polygons;
}
