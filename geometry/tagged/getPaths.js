import { eachItem } from './eachItem';

export const getPaths = (geometry) => {
  const paths = [];
  eachItem(geometry,
           item => {
             if (item.paths) {
               paths.push(item);
             }
           });
  return paths;
};
