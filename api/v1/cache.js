import memoizee from 'memoizee';

export const cache = (operator) => memoizee(operator, { length: false, max: 50 });
