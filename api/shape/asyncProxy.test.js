import test from 'ava';

const chainable = (op) => {
  let free, bound;

  // This is waiting for a shape or a chain.
  bound = (context) => ({
    apply(target, obj, args) {
      // Received a shape.
      const result = target(...args);
      return result;
    },
    get(target, prop, receiver) {
      if (prop === 'then') {
        const result = target(context);
        return (resolve, reject) => resolve(result);
      }
      return new Proxy(
        (...args) => async (s) => {
          const op = s[prop];
          return op(...args)(target(s))
        },
        free(context)
      );
    },
  });

  // This is waiting for arguments.
  free = (context) => ({
    apply(target, obj, args) {
      return new Proxy(target(...args), bound(obj));
    },
  });

  const result = new Proxy(op, free());
  return result;
};

const log = chainable((a) => async (s) => {
  console.log(`LOG ${a}`);
  return s;
});

test('chainable', async (t) => {
  const ap = log(1).log(2).log(3).log(4).log(5);
  const { name } = await ap({ log, name: 'v' });
  t.is(name, 'v');
});

test('fluent', async (t) => {
  const o = { log };
  const ap = o.log(1).log(2).log(3).log(4).log(5);
  const { name } = await ap({ log, name: 'v' });
  t.is(name, 'v');
});
