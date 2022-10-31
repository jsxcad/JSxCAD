import test from 'ava';

const clean = (v) => JSON.parse(JSON.stringify(v));

let complete, incomplete, chain;

incomplete = {
  apply(target, obj, args) {
    const result = target(...args);
    if (typeof result !== 'function') {
      throw Error(`Incomplete op must evaluate to function, not ${typeof result}: ${'' + target}`);
    }
    return new Proxy(result, complete);
  },
  get(target, prop, receiver) {
    if (prop === 'chain') {
      return 'incomplete';
    }
  }
};

// This is a complete chain.
complete = {
  apply(target, obj, args) {
    return target(...args);
  },
  get(target, prop, receiver) {
    if (prop === 'chain') {
      return 'complete';
    }
    if (prop === 'then') {
      return async (resolve, reject) => {
        resolve(target());
      }
    }
    return new Proxy(
      (...args) =>
        async (terminal) => {
          const s = await target(terminal);
          const op = Reflect.get(s, prop);
          if (typeof op !== 'function') {
            throw Error(`${s}[${prop}] must be function, not ${typeof op}: ${'' + op}`);
          }
          return await op(...args)(s);
        },
      incomplete);
  }
};

chain = (shape) => {
  const root = {
    apply(target, obj, args) {
      return target;
    },
    get(target, prop, receiver) {
      if (prop === 'chain') {
        return 'chain';
      }
      if (prop === 'then') {
        return target;
      }
      return new Proxy(
        (...args) =>
          async (terminal) => {
            const op = Reflect.get(target, prop);
            return op(...args)(target);
          },
        incomplete);
    }
  };
  const result = new Proxy(shape, root);
  return result;
};

const chainable = (op) => {
  return new Proxy(
    (...args) =>
       async (terminal) => {
         return op(...args)(terminal);
       },
     incomplete);
};

const alog = (a) => async (s) => {
  console.log(`#################### QQ/alog: ${a}`);
  s.a = a;
  return s;
};

const slog = (a) => (s) => {
  console.log(`#################### QQ/slog: ${a}`);
  s.a = a;
  return s;
};

test('chainable', async (t) => {
  const ap = chainable(slog)(1).slog(2).alog(3).slog(4).alog(5);
  const r = await ap({ alog, slog, name: 'v' });
  t.deepEqual(clean(r), { name: 'v', a: 5 });
});

test('fluent class', async (t) => {
  class Fluent {
    constructor() {
      this.name = 'v';
    }
  };
  Fluent.prototype.alog = alog;
  Fluent.prototype.slog = slog;
  const o = chain(new Fluent());
  const r = await o.alog(1).slog(2).alog(3).slog(4).alog(5);
  t.deepEqual(clean(r), { name: 'v', a: 5 });
});
