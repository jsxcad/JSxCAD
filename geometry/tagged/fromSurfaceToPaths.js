const fromSurfaceToPathsImpl = (surface) => {
  return { type: 'paths', paths: surface };
};

export const fromSurfaceToPaths = fromSurfaceToPathsImpl;
