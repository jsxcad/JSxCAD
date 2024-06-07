import { eachItem } from './tagged/eachItem.js';

export const ensurePages = (geometry, depth = 0) => {
  const sheets = [];
  eachItem(geometry, (item) => {
    if (item.type === 'item' && item.tags.includes('pack:sheet')) {
      sheets.push(item);
    }
  });
  if (sheets.length === 0) {
    // If there are no packed sheets, assume the geometry is one big sheet.
    sheets.push(geometry);
  }
  return sheets;
};
