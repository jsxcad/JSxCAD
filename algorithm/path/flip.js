const flip = (path) => {
  if (path[0] === null) {
    return [null, ...path.slice(1).reverse()];
  } else {
    return path.slice().reverse();
  }
};

module.exports = flip;
