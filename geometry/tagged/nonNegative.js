import { hasMatchingTag } from './hasMatchingTag';
import { rewriteTags } from './rewriteTags';

// Dropped elements displace as usual, but are not included in positive output.

export const isNonNegative = (geometry) =>
  hasMatchingTag(geometry.tags, ['compose/non-negative']);

export const isNegative = (geometry) => !isNonNegative(geometry);

export const nonNegative = (tags, geometry) =>
  rewriteTags(['compose/non-negative'], [], geometry, tags, 'has');

export const hasNonNegativeTag = (tags = []) =>
  tags.includes('compose/non-negative');
