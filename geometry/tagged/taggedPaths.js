export const taggedPaths = ({ tags = [] }, paths) => ({
  type: 'paths',
  tags,
  paths,
});
