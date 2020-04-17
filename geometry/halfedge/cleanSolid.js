import fromSolid from './fromSolid';
import toSolid from './toSolid';

export const cleanSolid = (solid, normalize) => {
  const loops = fromSolid(solid, normalize);
  const shell = toSolid(loops);
  return shell;
};

export default cleanSolid;
