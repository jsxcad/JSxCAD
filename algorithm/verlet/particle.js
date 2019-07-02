export const particle = (id, [x = 0, y = 0, z = 0] = []) => ({ id, position: [x, y, z], lastPosition: [x, y, z] });
