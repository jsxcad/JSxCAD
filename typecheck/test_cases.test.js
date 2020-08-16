import FsMonkey from 'fs-monkey';
import MemFs from 'memfs';
import UnionFs from 'unionfs';
import fs from 'fs';
import { setCaches } from './utils.js';
import test from 'ava';
import { typecheckModule } from './typecheckModule.js';

const { Union } = UnionFs;
const { Volume } = MemFs;
const { patchFs } = FsMonkey;

const baseFs = { ...fs };

const trim = (text) => text.trim();

const notEmpty = (text) => text.length > 0;

const readTestCases = async (path) => {
  const testCases = [];
  const text = await fs.promises.readFile(path, {
    encoding: 'utf8',
  });
  for (const testCase of text.split('=====\n').filter(notEmpty).map(trim)) {
    const [caseName, expected, ...files] = testCase.split('-----\n').map(trim);
    const expectedMessages = expected.split('\n').filter(notEmpty).map(trim);
    const filesystem = {};
    let filePath;
    for (const file of files) {
      const [filename, content] = file.split('~~~~~').map(trim);
      if (filePath === undefined) {
        filePath = filename;
      }
      filesystem[filename] = content;
    }
    if (filePath) {
      testCases.push({ caseName, filePath, filesystem, expectedMessages });
    }
  }
  return testCases;
};

const run = async (filePath, filesystem) => {
  const vol = Volume.fromJSON(filesystem);
  const ufs = new Union();
  ufs.use(vol).use(baseFs);
  const unpatchFs = patchFs(ufs);
  setCaches({});
  try {
    return typecheckModule(filePath);
  } finally {
    unpatchFs();
  }
};

const lint = async ({
  t,
  caseName,
  filePath,
  filesystem,
  expectedMessages,
}) => {
  const collectedMessages = [];
  for (const { message } of await run(filePath, filesystem)) {
    collectedMessages.push(message);
  }

  const fsText = JSON.stringify(filesystem);

  const produced = `\n${caseName}\n-----\n${fsText}\n-----\n${collectedMessages.join(
    '\n'
  )}\n`;
  const expected = `\n${caseName}\n-----\n${fsText}\n-----\n${expectedMessages.join(
    '\n'
  )}\n`;

  t.is(produced, expected);
};

test('Test Cases', async (t) => {
  for (const {
    caseName,
    filePath,
    filesystem,
    expectedMessages,
  } of await readTestCases('test_cases.txt')) {
    if (filePath) {
      await lint({ t, caseName, filePath, filesystem, expectedMessages });
    }
  }
});
