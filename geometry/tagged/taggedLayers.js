export const taggedLayers = ({ tags }, ...content) => {
  if (content.some(value => !value)) {
    throw Error(`Undefined Layers content`);
  }
  if (content.some(value => value.length)) {
    throw Error(`Layers content is an array`);
  }
  return { type: 'layers', tags, content };
};
