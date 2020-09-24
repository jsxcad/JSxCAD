import Occt from './occt.cjs';

let occt;

export const getOcct = () => {
  if (occt === undefined) {
   occt = Occt();
  }
  return occt;
}
