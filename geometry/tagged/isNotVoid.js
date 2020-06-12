export const isNotVoid = ({ tags }) =>
  tags === undefined || tags.includes("compose/non-positive") === false;

export const isVoid = (geometry) => !isNotVoid(geometry);
