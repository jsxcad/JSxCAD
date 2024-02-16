import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { transform } from './transform.js';

export const at = (geometry, selection) => {
  const { local, global } = getInverseMatrices(geometry);
  const { local: selectionLocal, global: selectionGlobal } =
    getInverseMatrices(selection);
  const localGeometry = transform(geometry, local);
  const selectionLocalGeometry = transform(localGeometry, selectionLocal);
  // We split this operation to allow the caller to do arbitrary operations in the middle.
  return [
    selectionLocalGeometry,
    (newSelectionLocalGeometry) => {
      const newSelectionGlobalGeometry = transform(
        newSelectionLocalGeometry,
        selectionGlobal
      );
      const newGlobalGeometry = transform(newSelectionGlobalGeometry, global);
      return newGlobalGeometry;
    },
  ];
};
