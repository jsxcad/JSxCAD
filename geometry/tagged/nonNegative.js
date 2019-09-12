import { addTags } from './addTags';
import { hasMatchingTag } from './hasMatchingTag';

// Dropped elements displace as usual, but are not included in positive output.

export const isNonNegative = (geometry) => hasMatchingTag(geometry.tags, ['compose/non-negative']);

export const isNegative = (geometry) => !isNonNegative(geometry);

export const nonNegative = (tags, geometry) => addTags(['compose/non-negative'], geometry, tags, 'has');

export const hasNonNegativeTag = (tags = []) => tags.includes('compose/non-negative');
