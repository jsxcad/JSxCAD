import { registry } from './reify.js';

// We expect the type to be uniquely qualified.
export const registerReifier = (type, reifier) => registry.set(type, reifier);
