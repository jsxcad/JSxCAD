export const edgesToPolygons = ({}, edges) => {
  // Build an map of start to ends.
  let edgeMap = new Map();
  for (const [startPoint, endPoint] of edges) {
    let startKey = JSON.stringify(startPoint);
    let endPoints = edgeMap.get(startKey);
    if (endPoints === undefined) {
      edgeMap.set(startKey, [endPoint]);
    } else {
      endPoints.push(endPoint);
    }
  }

  // Traverse the graph.
  for (const startPoint of edgeMap.keys()) {
  }
}
