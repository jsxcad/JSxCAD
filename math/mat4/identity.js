/**
 * Set a mat4 to the identity matrix
 *
 * @returns {mat4} out
 */

export const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

// FIX: Move to cgal.
identityMatrix.blessed = true;

export const identity = () => identityMatrix;
