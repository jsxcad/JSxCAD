import test from "ava";
import { toEcmascript } from "./toEcmascript";
import { write } from "@jsxcad/sys";

Error.stackTraceLimit = Infinity;

test("Wrap and return.", async (t) => {
  const ecmascript = await toEcmascript(
    `export const foo = (x) => x + 1;
       export const main = async () => {
         let a = 10;
         return circle(foo(a));
       }`
  );
  t.is(
    ecmascript,
    `
const foo = x => x + 1;
const main = async () => {
  let a = 10;
  return circle(foo(a));
};
return {
  foo,
  main
};
`
  );
});

test("Don't return declarations.", async (t) => {
  const ecmascript = await toEcmascript(`let a = 10;`);
  t.is(
    ecmascript,
    `
let a = 10;
return {};
`
  );
});

test("Bind await to calls properly.", async (t) => {
  const ecmascript = await toEcmascript(`foo().bar()`);
  t.is(
    ecmascript,
    `
foo().bar();
return {};
`
  );
});

test("Top level await.", async (t) => {
  const ecmascript = await toEcmascript(`await foo()`);
  t.is(
    ecmascript,
    `
await foo();
return {};
`
  );
});

test("Wrap on long implicit return expression is not malformed.", async (t) => {
  const ecmascript = await toEcmascript(`
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`);
  t.is(
    ecmascript,
    `
foo();
await bar({
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
}, 2);
return {};
`
  );
});

test("Import", async (t) => {
  const ecmascript = await toEcmascript('import { foo } from "bar";');
  t.is(
    ecmascript,
    `
const {foo} = await importModule('bar');
return {};
`
  );
});

test("Definition", async (t) => {
  const ecmascript = await toEcmascript(
    "const a = 1; const b = () => 2; function c () {}"
  );
  t.is(
    ecmascript,
    `
const a = 1;
const b = () => 2;
function c() {}
return {};
`
  );
});

test("Reference", async (t) => {
  const ecmascript = await toEcmascript(
    "const a = 1; const b = () => a; const c = () => b();"
  );
  t.is(
    ecmascript,
    `
const a = 1;
const b = () => a;
const c = () => b();
return {};
`
  );
});

test("Default Import", async (t) => {
  const ecmascript = await toEcmascript('import Foo from "bar";');
  t.is(
    ecmascript,
    `
const Foo = (await importModule('bar')).default;
return {};
`
  );
});

test("Unassigned Import", async (t) => {
  const ecmascript = await toEcmascript('import "bar";');
  t.is(
    ecmascript,
    `
await importModule('bar');
return {};
`
  );
});

test("Reuse and Redefine", async (t) => {
  // Establish
  await write("data/def/A", 1);
  await write("meta/def/A", {
    sha: "da8b2b5ce546b8af68cea7d5a9c27efe2a4fd8e3",
  });

  // Reuse
  const reuse = await toEcmascript(
    "const A = foo(); const B = () => 2; function C () {}"
  );
  t.is(
    reuse,
    `
const A = await read('data/def/A');
const B = () => 2;
function C() {}
return {};
`
  );

  // Redefine
  const redefine = await toEcmascript(
    "const A = bar(); const B = () => 2; function C () {}"
  );
  t.is(
    redefine,
    `
const A = bar();
(await write('data/def/A', A)) && (await write('meta/def/A', {
  sha: '8e0d3a8ac5c7a9b2684fa19794087e7e4223cd53'
}));
const B = () => 2;
function C() {}
return {};
`
  );
});

test("Indirect Redefinition", async (t) => {
  // Establish
  await write("data/def/D", 1);
  await write("meta/def/D", {
    sha: "dbefe81bda93e322be22b4a3ccf53c3c43173192",
  });
  await write("data/def/E", 1);
  await write("meta/def/E", {
    sha: "38106474eafb9ef3606469a77c07042e325a4bb0",
  });

  // Demonstrate reuse.
  const reuse = await toEcmascript("const D = foo(); const E = () => D;");
  t.is(
    reuse,
    `
const D = await read('data/def/D');
const E = () => D;
return {};
`
  );
});

test("Bad Redefinition", async (t) => {
  // Demonstrate defined case.
  await write("meta/def/mountainView", {
    sha: "b59f37ba343f2a4a9ddf44b1091190f973b19743",
  });
  const define = await toEcmascript(
    `
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`
  );

  t.is(
    define,
    `
const Mountain = () => foo();
const mountainView = await read('data/def/mountainView');
mountainView.frontView({
  position: [0, -100, 50]
});
return {};
`
  );

  const redefine = await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`
  );

  t.is(
    redefine,
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
(await write('data/def/mountainView', mountainView)) && (await write('meta/def/mountainView', {
  sha: 'bdf04f14234eed622dfca3aa405abd88911ea304'
}));
mountainView.frontView({
  position: [0, -100, 50]
});
return {};
`
  );
});
