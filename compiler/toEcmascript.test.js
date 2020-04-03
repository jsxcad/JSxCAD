import test from 'ava';
import { toEcmascript } from './toEcmascript';

Error.stackTraceLimit = Infinity;

test('Wrap and return.', t => {
  const ecmascript = toEcmascript(`export const foo = (x) => x + 1;
                                   export const main = async () => {
                                     let a = 10;
                                     return circle(foo(a));
                                   }`);
  t.is(ecmascript,
`
export const foo = x => x + 1;
export const main = async () => {
  let a = 10;
  return circle(foo(a));
};
return {
  foo,
  main
};
`);
});

test("Don't return declarations.", t => {
  const ecmascript = toEcmascript(`let a = 10;`);
  t.is(ecmascript,
`
let a = 10;
return {};
`);
});

test('Bind await to calls properly.', t => {
  const ecmascript = toEcmascript(`foo().bar()`);
  t.is(ecmascript,
`
foo().bar();
return {};
`);
});

test('Top level await.', t => {
  const ecmascript = toEcmascript(`await foo()`);
  t.is(ecmascript,
`
await foo();
return {};
`);
});

test('Wrap on long implicit return expression is not malformed.', t => {
  const ecmascript = toEcmascript(`
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`);
  t.is(ecmascript,
`
foo();
await bar({
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
}, 2);
return {};
`);
});

test('Import', t => {
  const ecmascript = toEcmascript('import { foo } from "bar";');
  t.is(ecmascript, `
const $module = (() => {
  return {};
})();
const {foo} = $module;
return {};
`);
});

test('Definition', t => {
  const ecmascript = toEcmascript('const a = 1; const b = () => 2; function c () {}');
  t.is(ecmascript,
`
const a = 1;
const b = () => 2;
function c() {}
return {};
`);
});

test('Reference', t => {
  const ecmascript = toEcmascript('const a = 1; const b = () => a; const c = () => b();');
  t.is(ecmascript,
`
const a = 1;
const b = () => a;
const c = () => b();
return {};
`);
});

/*
test('Default Import', t => {
  const ecmascript = toEcmascript('import Foo from "bar";');
  t.is(ecmascript, `return async () => {
  const Foo = (await importModule('bar')).default;
  const main = async () => {};
  return {
    main
  };
};
`);
});

test('Unassigned Import', t => {
  const ecmascript = toEcmascript('import "bar";');
  t.is(ecmascript, `return async () => {
  await importModule('bar');
  const main = async () => {};
  return {
    main
  };
};
`);
});
*/
