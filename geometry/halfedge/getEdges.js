/**
 * getEdges
 *
 * @param loop
 */
export const getEdges = (loop) => {
  let value = loop;
  let done = false;
  return {
    /**
     * @returns {object}
     */
    next:
      () => {
        const result = { value, done };
        value = value.next;
        if (value === loop) {
          done = true;
        }
        return result;
      },
    /**
     * @returns {object}
     */
    [Symbol.iterator]: function () { return this; }
  };
};

export default getEdges;
