export const removeEdge = (edge) => {
  const next = edge.next;
  if (edge.twin) {
    // Unlink any edge.
    edge.twin.twin = undefined;
  }

  let face = edge.face;
  face.plane = undefined;
  if (face === edge) {
    // This edge was the face, move it around to the next one.
    face.holes = edge.holes;
    edge.holes = undefined;
    face = edge.next;
  }

  let link = edge;
  do {
    if (link.next === edge) {
      link.next = edge.next;
      break;
    }
    link.face = face;
    link = link.next;
  } while (link !== edge);

  edge.next = undefined;
  edge.face = undefined;
  edge.twin = undefined;

  return next;
};

export default removeEdge;
