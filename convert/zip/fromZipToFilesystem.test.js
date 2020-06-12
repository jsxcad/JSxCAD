import { readFile as readFsFile, setupFilesystem } from "@jsxcad/sys";

import { fromZipToFilesystem } from "./fromZipToFilesystem";
import fs from "fs";
import test from "ava";

const { readFile } = fs.promises;

test("Simple", async (t) => {
  setupFilesystem({ fileBase: "from" });
  const zip = await readFile("test.zip");
  await fromZipToFilesystem({}, zip);
  const observation = await readFsFile(
    { doSerialize: false },
    "file/hello.txt"
  );
  t.is(new TextDecoder("utf8").decode(observation), "hello");
});
