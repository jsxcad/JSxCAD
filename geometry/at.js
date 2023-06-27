import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { transform } from './transform.js';

export const at = (geometry, selection, op) => {
  const { local, global } = getInverseMatrices(geometry);
  const { local: selectionLocal, global: selectionGlobal } =
    getInverseMatrices(selection);
  const localGeometry = transform(geometry, local);
  const selectionGlobalGeometry = transform(localGeometry, selectionGlobal);
  // We split this operation to allow the caller to do arbitrary operations in the middle.
  return [
    selectionGlobalGeometry,
    (newSelectionGlobalGeometry) => {
      const newSelectionLocalGeometry = transform(
        newSelectionGlobalGeometry,
        selectionLocal
      );
      const newGlobalGeometry = transform(newSelectionLocalGeometry, global);
      return newGlobalGeometry;
    },
  ];
};
