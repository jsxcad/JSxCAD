import Path from './Path.js';

export const Toolpath = (...points) =>
  Path(...points).setTags(['path/Toolpath']);

export default Toolpath;
