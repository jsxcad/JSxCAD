import { eachItem } from './eachItem';

export const getConnections = (geometry) => {
  const connections = [];
  eachItem(geometry,
           item => {
             if (item.connection) {
               connections.push(item);
             }
           });
  return connections;
};
