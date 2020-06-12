import { eachItem } from "./eachItem";

export const getConnections = (geometry) => {
  const connections = [];
  eachItem(geometry, (geometry) => {
    if (geometry.connection) {
      connections.push(geometry);
    }
  });
  return connections;
};
