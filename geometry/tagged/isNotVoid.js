export const isNotVoid = ({ tags }) => {
  return tags === undefined || tags.includes('type:void') === false;
};

export const isVoid = (geometry) => !isNotVoid(geometry);
