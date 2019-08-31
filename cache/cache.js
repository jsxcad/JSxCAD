import memoize from 'micro-memoize';

// This is a very thin abstraction layer to decouple from any particular cache implementation.

export const cache = (op) => memoize(op, { maxSize: 50 });
