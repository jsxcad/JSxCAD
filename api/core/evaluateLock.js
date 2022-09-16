let locked = false;
const pending = [];

export const acquire = async () => {
  if (locked) {
    return new Promise((resolve, reject) => pending.push(resolve));
  } else {
    locked = true;
  }
};

export const release = async () => {
  if (pending.length > 0) {
    const resolve = pending.pop();
    resolve(true);
  } else {
    locked = false;
  }
};
