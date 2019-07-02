import test from 'ava';
import { toEcmascript } from './toEcmascript';

test('Wrap and return.', t => {
  const ecmascript = toEcmascript({},
                                  `export const foo = (x) => x + 1;
                                   export const main = async () => {
                                     let a = 10;
                                     return circle(foo(a));
                                   }`);
  console.log(ecmascript);
  t.is(ecmascript,
       `return async () => {
    const foo = (x) => x + 1;

    const main = async () => {
      let a = 10;
      return circle(foo(a));
    };

    return {
        foo: foo,
        main: main
    };
};`);
});

test("Don't return declarations.", t => {
  const ecmascript = toEcmascript({},
                                  `let a = 10;`);
  t.is(ecmascript,
       `return async () => {
    const main = async () => {
        let a = 10;
    };

    return {
        main: main
    };
};`);
});

test('Bind await to calls properly.', t => {
  const ecmascript = toEcmascript({}, `foo().bar()`);
  t.is(ecmascript,
       `return async () => {
    const main = async () => {
        return foo().bar();
    };

    return {
        main: main
    };
};`);
});

test('Top level await.', t => {
  const ecmascript = toEcmascript({}, `await foo()`);
  t.is(ecmascript,
       `return async () => {
    const main = async () => {
        return await foo();
    };

    return {
        main: main
    };
};`);
});

test('Wrap on long implicit return expression is not malformed.', t => {
  const ecmascript = toEcmascript({}, `
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`);
  t.is(ecmascript,
       `return async () => {
    const main = async () => {
        foo();
        return await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
    };

    return {
        main: main
    };
};`);
});

test('Import', t => {
  const ecmascript = toEcmascript({}, 'import { foo } from "bar";');
  t.is(ecmascript, `return async () => {
    const {
        foo: foo
    } = await importModule("bar", []);

    const main = async () => {};

    return {
        main: main
    };
};`);
});

test('Import Map', t => {
  const ecmascript = toEcmascript({}, `
    ({
       "imports": {
         "moment": "/node_modules/moment/src/moment.js",
         "lodash": ["/node_modules/lodash-es/lodash.js"]
       }
     })

    import { foo } from "moment";

    foo();
    `);
  t.is(ecmascript, `return async () => {
    const {
        foo: foo
    } = await importModule("moment", "/node_modules/moment/src/moment.js");

    const main = async () => {
        return foo();
    };

    return {
        main: main
    };
};`);
});
