export const getEdges = (loop) => {
  let value = loop;
  let done = false;
  return {
    next: () => {
      const result = { value, done };
      value = value.next;
      if (value === loop) {
        done = true;
      }
      return result;
    },
    [Symbol.iterator]: function () { return this; }
  };
};

export default getEdges;
