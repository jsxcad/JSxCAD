const abs = require('./abs');
const fromValues = require('./fromValues');

// find a vector that is somewhat perpendicular to this one
const random = (vec) => {
  const temp = abs(vec);
  if ((temp[0] <= temp[1]) && (temp[0] <= temp[2])) {
    return fromValues(1, 0, 0);
  } else if ((temp[1] <= temp[0]) && (temp[1] <= temp[2])) {
    return fromValues(0, 1, 0);
  } else {
    return fromValues(0, 0, 1);
  }
};

module.exports = random;
