import test from 'ava';
import { toEcmascript } from './toEcmascript';

test('Wrap and return.', t => {
  const ecmascript = toEcmascript({},
                                  `export const foo = (x) => x + 1;
                                   let a = 10;
                                   circle(foo(a));`);
  t.is(ecmascript,
       `const foo = async x => x + 1;

const main = async () => {
    let a = 10;
    return (await circle((await foo(a))));;
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
    return (await (await foo()).bar());
};

return {
    main: main
};`);
});
