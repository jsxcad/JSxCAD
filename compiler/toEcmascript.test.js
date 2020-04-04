import test from 'ava';
import { toEcmascript } from './toEcmascript';
import { write } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

test('Wrap and return.', async t => {
  const ecmascript = await toEcmascript(
    `export const foo = (x) => x + 1;
       export const main = async () => {
         let a = 10;
         return circle(foo(a));
       }`);
  t.is(ecmascript,
       `
const foo = x => x + 1;
(await write('data/def/foo', foo)) && (await write('meta/def/foo', {
  sha: '008b1005955db6f5a1a6299423135098172bd4e5'
}));
const main = async () => {
  let a = 10;
  return circle(foo(a));
};
(await write('data/def/main', main)) && (await write('meta/def/main', {
  sha: '028a01af7d5a755af9fa0c935a84896829cbee10'
}));
return {
  foo,
  main
};
`);
});

test("Don't return declarations.", async t => {
  const ecmascript = await toEcmascript(`let a = 10;`);
  t.is(ecmascript,
       `
let a = 10;
(await write('data/def/a', a)) && (await write('meta/def/a', {
  sha: 'd561d68cbf098ae1553e5e902e9187f6dfea935f'
}));
return {};
`);
});

test('Bind await to calls properly.', async t => {
  const ecmascript = await toEcmascript(`foo().bar()`);
  t.is(ecmascript,
       `
foo().bar();
return {};
`);
});

test('Top level await.', async t => {
  const ecmascript = await toEcmascript(`await foo()`);
  t.is(ecmascript,
       `
await foo();
return {};
`);
});

test('Wrap on long implicit return expression is not malformed.', async t => {
  const ecmascript = await toEcmascript(`
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

test('Import', async t => {
  const ecmascript = await toEcmascript('import { foo } from "bar";');
  t.is(ecmascript,
       `
const {foo} = await importModule('bar');
return {};
`);
});

test('Definition', async t => {
  const ecmascript = await toEcmascript('const a = 1; const b = () => 2; function c () {}');
  t.is(ecmascript,
       `
const a = 1;
(await write('data/def/a', a)) && (await write('meta/def/a', {
  sha: '7987f4ac835294eae5154cc1854d0b7e62d9497b'
}));
const b = () => 2;
(await write('data/def/b', b)) && (await write('meta/def/b', {
  sha: '246f1adc25377588b0c672533e0c47d197883181'
}));
function c() {}
return {};
`);
});

test('Reference', async t => {
  const ecmascript = await toEcmascript('const a = 1; const b = () => a; const c = () => b();');
  t.is(ecmascript,
       `
const a = 1;
(await write('data/def/a', a)) && (await write('meta/def/a', {
  sha: '7987f4ac835294eae5154cc1854d0b7e62d9497b'
}));
const b = () => a;
(await write('data/def/b', b)) && (await write('meta/def/b', {
  sha: '73a78c48a7000fd8741be691d9afcaa7d74ca4bc'
}));
const c = () => b();
(await write('data/def/c', c)) && (await write('meta/def/c', {
  sha: '8255f5c35b450ad7eb08f013a6363bc53399e65a'
}));
return {};
`);
});

test('Default Import', async t => {
  const ecmascript = await toEcmascript('import Foo from "bar";');
  t.is(ecmascript, `
const Foo = (await importModule('bar')).default;
return {};
`);
});

test('Unassigned Import', async t => {
  const ecmascript = await toEcmascript('import "bar";');
  t.is(ecmascript, `
await importModule('bar');
return {};
`);
});

test('Reuse and Redefine', async t => {
  // Establish
  await write('data/def/A', 1);
  await write('meta/def/A', { sha: '5b3dfe978f3521c5b9d5fd7fafad931e90a9c8ee' });

  // Reuse
  const reuse = await toEcmascript('const A = 1; const B = () => 2; function C () {}');
  t.is(reuse,
       `
const A = await read('data/def/A');
const B = () => 2;
(await write('data/def/B', B)) && (await write('meta/def/B', {
  sha: '4d0550a1c1ad778bb112bbb97580d30aecb2a9bc'
}));
function C() {}
return {};
`);

  // Redefine
  const redefine = await toEcmascript('const A = 2; const B = () => 2; function C () {}');
  t.is(redefine,
       `
const A = 2;
(await write('data/def/A', A)) && (await write('meta/def/A', {
  sha: '232bdd4050e94d6e8881b92239c649f69b29c71f'
}));
const B = () => 2;
(await write('data/def/B', B)) && (await write('meta/def/B', {
  sha: '4d0550a1c1ad778bb112bbb97580d30aecb2a9bc'
}));
function C() {}
return {};
`);
});

test('Indirect Redefinition', async t => {
  // Establish
  await write('data/def/D', 1);
  await write('meta/def/D', { sha: '23a7b70af59f90622aee1405da30440e6f4d423f' });
  await write('data/def/E', 1);
  await write('meta/def/E', { sha: '38106474eafb9ef3606469a77c07042e325a4bb0' });

  // Demonstrate reuse.
  const reuse = await toEcmascript('const D = 1; const E = () => D;');
  t.is(reuse,
       `
const D = await read('data/def/D');
const E = await read('data/def/E');
return {};
`);

  // Demonstrate redefinition cascade.
  const redefine = await toEcmascript('const D = 2; const E = () => D;');
  t.is(redefine,
       `
const D = 2;
(await write('data/def/D', D)) && (await write('meta/def/D', {
  sha: 'ca269f8de72bd9bb26cfca68ee6c3319a58fdba0'
}));
const E = () => D;
(await write('data/def/E', E)) && (await write('meta/def/E', {
  sha: '9d780ac0f0c57e0de1773d9883e4c386a9332b4e'
}));
return {};
`);
});
