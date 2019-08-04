import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

export const keep = (tags, geometry) => addTags(['@drop'], geometry, (geometryTags) => !hasMatchingTag(geometryTags, tags));
