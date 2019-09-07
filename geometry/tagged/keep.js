import { addTags } from './addTags';

export const keep = (tags, geometry) => addTags(['compose/non-positive'], geometry, tags, 'has not');
