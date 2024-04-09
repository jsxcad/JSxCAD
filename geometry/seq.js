const EPSILON = 1e-5;
const SEQ_KEYS = ['downto', 'from', 'steps', 'to', 'by', 'end', 'upto'];

export const seq = (...specs) => {
  const indexes = [];
  for (const spec of specs) {
    let { from = 0, to = 1, by = 1, steps, upto, downto } = spec;

    let consider;

    if (steps !== undefined) {
      if (upto === undefined && downto === undefined) {
        by = (to - from) / steps;
      } else {
        by = ((upto || downto) - from) / (steps - 1);
      }
    }

    if (by > 0) {
      if (upto === undefined) {
        consider = (value) => value < to - EPSILON;
      } else {
        consider = (value) => value <= upto + EPSILON;
      }
    } else if (by < 0) {
      if (downto === undefined) {
        consider = (value) => value > to + EPSILON;
      } else {
        consider = (value) => value >= downto - EPSILON;
      }
    } else {
      throw Error('seq: Expects by != 0');
    }
    const numbers = [];
    for (let number = from, nth = 0; consider(number); number += by, nth++) {
      numbers.push(number);
    }
    indexes.push(numbers);
  }
  const results = [];
  const index = indexes.map(() => 0);
  for (;;) {
    const args = index.map((nth, index) => indexes[index][nth]);
    if (args.some((value) => value === undefined)) {
      break;
    }
    results.push(args);
    let nth;
    for (nth = 0; nth < index.length; nth++) {
      if (++index[nth] < indexes[nth].length) {
        break;
      }
      index[nth] = 0;
    }
    if (nth === index.length) {
      break;
    }
  }

  return results;
};

export const isSeqSpec = (value) => {
  if (!(value instanceof Object)) {
    return false;
  }
  let count = 0;
  for (const key of Object.keys(value)) {
    if (!SEQ_KEYS.includes(key)) {
      return false;
    }
    count++;
  }
  if (count === 0) {
    return false;
  }
  return true;
};
