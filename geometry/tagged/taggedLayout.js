export const taggedLayout = (
  { tags = [], matrix, provenance, size, margin, title },
  ...content
) => {
  if (content.some((value) => value === undefined)) {
    throw Error(`Undefined Layout content`);
  }
  if (content.some((value) => value.length)) {
    throw Error(`Layout content is an array`);
  }
  if (content.some((value) => value.geometry)) {
    throw Error(`Likely Shape in Layout`);
  }
  return {
    type: 'layout',
    layout: { size, margin, title },
    tags,
    matrix, provenance,
    content,
  };
};
