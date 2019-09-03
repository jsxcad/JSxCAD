import { addTags } from './addTags';

export const keep = (tags, geometry) => addTags(['@drop'], geometry, tags, 'has not');
