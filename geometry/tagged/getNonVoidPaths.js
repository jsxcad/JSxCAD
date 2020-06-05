import { eachNonVoidItem } from './eachNonVoidItem';

export const getNonVoidPaths = (geometry) => {
  const pathsets = [];
  eachNonVoidItem(geometry,
                  item => {
                    if (item.paths) {
                      pathsets.push(item);
                    }
                  });
  return pathsets;
};
