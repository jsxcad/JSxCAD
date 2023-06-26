import test from 'ava';

const log = (a) => (s) => {
  console.log(`LOG ${a}`);
  return s;
};

test('simple', (t) => {
  let free, bound;

  // This is waiting for a shape or a chain.
  bound = {
    apply(target, obj, args) {
      // Received a shape.
      return target(...args);
    },
    get(target, prop, _receiver) {
      return new Proxy(
        (...args) =>
          (s) =>
            s[prop](...args)(target(s)),
        free
      );
    },
  };

  // This is waiting for arguments.
  free = {
    apply(target, obj, args) {
      return new Proxy(target(...args), bound);
    },
  };

  const op = new Proxy(log, free);
  const ap = op(1).log(2).log(3);
  const v = ap({ log, name: 'v' });
  t.deepEqual(JSON.parse(JSON.stringify(v)), { name: 'v' });
});
