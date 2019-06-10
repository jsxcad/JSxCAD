import test from 'ava';
import { toEcmascript } from './toEcmascript';

test('Wrap and return.', t => {
  const ecmascript = toEcmascript({},
                                  `export const foo = (x) => x + 1;
                                   let a = 10;
                                   circle(foo(a));`);
  t.is(ecmascript,
       `const foo = (x) => x + 1;

const main = async () => {
    let a = 10;
    return circle(foo(a));;
};

return {
    foo: foo,
    main: main
};`);
});

test("Don't return declarations.", t => {
  const ecmascript = toEcmascript({},
                                  `let a = 10;`);
  console.log(ecmascript);
  t.is(ecmascript,
       `const main = async () => {
    let a = 10;
};

return {
    main: main
};`);
});

test('Bind await to calls properly.', t => {
  const ecmascript = toEcmascript({}, `foo().bar()`);
  t.is(ecmascript,
       `const main = async () => {
    return foo().bar();
};

return {
    main: main
};`);
});

test('Top level await.', t => {
  const ecmascript = toEcmascript({}, `await foo()`);
  t.is(ecmascript,
       `const main = async () => {
    return await foo();
};

return {
    main: main
};`);
});
