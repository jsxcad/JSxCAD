export const hasMatchingTag = (set, tags, whenSetUndefined = false) => {
  if (set === undefined) {
    return whenSetUndefined;
  } else if (tags !== undefined && tags.some(tag => set.includes(tag))) {
    return true;
  } else {
    return false;
  }
};
