let locked = false;
const pending = [];

export const acquire = async () => {
  if (locked) {
    console.log(`QQ/acquire/wait`);
    return new Promise((resolve, reject) => pending.push(resolve));
  } else {
    console.log(`QQ/acquire`);
    locked = true;
  }
};

export const release = async () => {
  if (pending.length > 0) {
    console.log(`QQ/release/schedule`);
    const resolve = pending.pop();
    resolve(true);
  } else {
    locked = false;
    console.log(`QQ/release`);
  }
};
