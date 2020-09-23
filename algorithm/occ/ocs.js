import Ocs from './dist/occt.cjs';

let ocs;

export const getOcs = async () => {
  if (ocs === undefined) {
    ocs = Ocs.default();
  }
  return ocs;
}
