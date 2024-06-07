import { eachItem } from './eachItem.js';

export const getLayouts = (geometry) => {
  const layouts = [];
  eachItem(geometry, (item) => {
    if (item.type === 'item' && item.tags.includes('pack:sheet')) {
      layouts.push(item);
    }
  });
  return layouts;
};
