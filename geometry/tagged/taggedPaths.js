export const taggedPaths = ({ tags = [], matrix, provenance }, paths) => ({
  type: 'paths',
  tags,
  matrix, provenance,
  paths,
});
