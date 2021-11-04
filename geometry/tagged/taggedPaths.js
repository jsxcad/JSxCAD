export const taggedPaths = ({ tags = [], matrix }, paths) => ({
  type: 'paths',
  tags,
  matrix,
  paths,
});
