import { eachItem } from './eachItem';

export const getClouds = (geometry) => {
  const clouds = [];
  eachItem(geometry,
           item => {
             if (item.points) {
               clouds.push(item);
             }
           });
  return clouds;
};
