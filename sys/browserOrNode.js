/* global self */

export const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const checkIsWebWorker = () => {
  try {
    return (
      self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'
    );
  } catch (e) {
    return false;
  }
};

export const isWebWorker = checkIsWebWorker();

export const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;
