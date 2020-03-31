export const emitted = [];

export const clearEmitted = () => { emitted.length = 0; };

export const emit = (value) => emitted.push(value);

export const getEmitted = () => [...emitted];
