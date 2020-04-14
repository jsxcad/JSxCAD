export const previousEdge = (loop) => {
  let link = loop;
  while (link.next != loop) {
    link = link.next;
  }
  return link;
}

export default previousEdge;
