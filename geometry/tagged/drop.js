import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

// Dropped elements displace as usual, but are not included in positive output.

export const drop = (tags, geometry) => addTags(['@drop'], geometry, (geometryTags) => hasMatchingTag(geometryTags, tags));
