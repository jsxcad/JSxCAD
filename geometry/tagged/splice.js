import { rewriteUp } from './rewrite';

export const splice = (geometry, find, replace) =>
  rewriteUp(geometry, (geometry) =>
    geometry.connection === find.connection ? replace : geometry
  );
