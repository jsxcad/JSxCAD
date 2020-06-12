import { toSignature, toSnippet } from "./signature";

import test from "ava";

test("Circle.ofApothem", (t) => {
  const signature = toSignature(
    "Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape"
  );
  t.deepEqual(signature, {
    operation: { namespace: "Circle", name: "ofApothem" },
    args: [{ name: "apothem", type: "number", value: "1" }],
    options: [{ name: "sides", type: "number", value: "32" }],
    outputType: "Shape",
    string:
      "Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape",
  });
});

test("Shape.color", (t) => {
  const signature = toSignature("Shape -> .color(name:string) -> Shape");
  t.deepEqual(signature, {
    inputType: "Shape",
    operation: { name: "color", isMethod: true },
    args: [{ name: "name", type: "string" }],
    outputType: "Shape",
    string: "Shape -> .color(name:string) -> Shape",
  });
});

test("union", (t) => {
  const signature = toSignature("union(shape:Shape, ...shapes:Shape) -> Shape");
  t.deepEqual(signature, {
    operation: { name: "union" },
    args: [{ name: "shape", type: "Shape" }],
    rest: { name: "shapes", type: "Shape" },
    outputType: "Shape",
    string: "union(shape:Shape, ...shapes:Shape) -> Shape",
  });
});

test("output", (t) => {
  const signature = toSignature(
    "Shape -> .writeStl(path:string, { size:number })"
  );
  t.deepEqual(signature, {
    inputType: "Shape",
    operation: { name: "writeStl", isMethod: true },
    args: [{ type: "string", name: "path" }],
    options: [{ name: "size", type: "number" }],
    string: "Shape -> .writeStl(path:string, { size:number })",
  });
});

test("options and rest", (t) => {
  const signature = toSignature("foo({ size:number }, ...shapes:Shape)");
  t.deepEqual(signature, {
    operation: { name: "foo" },
    options: [{ name: "size", type: "number" }],
    rest: { name: "shapes", type: "Shape" },
    string: "foo({ size:number }, ...shapes:Shape)",
  });
});

test("method snippet generation", (t) => {
  const signature = toSignature("Shape -> .color(name:string) -> Shape");
  const snippet = toSnippet(signature);
  t.deepEqual(snippet, {
    meta: "Shape method",
    isMethod: true,
    name: ".color",
    trigger: "color",
    content: "color($1)",
    type: "snippet",
    docHTML: "Shape -> .color(name:string) -> Shape",
  });
});

test("constructor snippet generation", (t) => {
  const signature = toSignature(
    "Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape"
  );
  const snippet = toSnippet(signature);
  t.deepEqual(snippet, {
    meta: "Circle constructor",
    name: "Circle.ofApothem",
    trigger: "Circle.ofApothem",
    content: `Circle.ofApothem(${"$"}{1})`,
    type: "snippet",
    docHTML:
      "Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape",
  });
});
