import OpenCascadeJs from './dist/oc.cjs';

let oc;

export const getOc = async () => {
  if (oc === undefined) {
    oc = OpenCascadeJs.initOpenCascade();
  }
  return oc;
};
