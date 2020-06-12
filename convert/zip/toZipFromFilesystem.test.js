import { setupFilesystem, writeFile as writeFsFile } from "@jsxcad/sys";

import fs from "fs";
import test from "ava";
import { toZipFromFilesystem } from "./toZipFromFilesystem";

const { readFile, writeFile } = fs.promises;

test("Simple", async (t) => {
  setupFilesystem({ fileBase: "test" });
  await writeFsFile(
    { doSerialize: false },
    "file/hello.txt",
    new TextEncoder("utf8").encode("hello")
  );
  const observed = await toZipFromFilesystem();
  const expected = await readFile("test.zip");
  await writeFile("observed.zip", observed);
  t.deepEqual([...observed], [...expected]);
});
