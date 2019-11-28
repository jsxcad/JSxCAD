export const fromSurface = (surface) => surface.map(path => path.map(([X, Y]) => ({ X, Y })));
export const toSurface = (paths) => paths.map(path => path.map(({ X, Y }) => [X, Y, 0]));
