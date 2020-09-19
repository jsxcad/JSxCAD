import OpenCascadeJs from './dist/occ.cjs';

let occ;

export const getOcc = async () => {
  if (occ === undefined) {
    occ = OpenCascadeJs.initOpenCascade();
  }
  return occ;
};
