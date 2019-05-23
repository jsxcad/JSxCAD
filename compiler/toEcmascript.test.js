import { test } from 'ava';
import { toEcmascript } from './toEcmascript';

test('Wrap and return.', t => {
  const ecmascript = toEcmascript({},
                                  `export const foo = (x) => x + 1;
                                   let a = 10;
                                   circle(foo(a));`);
  console.log(ecmascript);
  t.is(ecmascript,
       `const foo = async x => x + 1;

const main = async () => {
    let a = 10;
    return await circle(await foo(a));;
};

return {
    foo: foo,
    main: main
};`);
});
