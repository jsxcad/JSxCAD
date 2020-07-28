const { patchFs, patchRequire } = require('fs-monkey');

const { ESLint } = require('eslint');
const { Volume } = require('memfs');
const { Union } = require('unionfs');
const fs = require('fs');
const baseFs = { ...fs };
const test = require('ava');

const buildLintOptions = () => ({
  plugins: ['@jsxcad/eslint-plugin-typelint'],
  rules: { '@jsxcad/typelint/typecheck': ['error'] },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 8,
    sourceType: `module`,
  },
});

const trim = (text) => text.trim();

const notEmpty = (text) => text.length > 0;

const readTestCases = async (path) => {
  const testCases = [];
  const text = await fs.promises.readFile(`${__dirname}/${path}`, { encoding: 'utf8' });
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

const runEsLint = async (filePath, filesystem) => {
  const eslint = new ESLint({ baseConfig: buildLintOptions(), useEslintrc: false });
  const vol = Volume.fromJSON(filesystem);
  const ufs = new Union();
  ufs.use(vol).use(baseFs);
  const unpatchFs = patchFs(ufs);
  try {
    return await eslint.lintFiles(filePath);
  } finally {
    unpatchFs();
  }
}

const lint = async ({ t, caseName, filePath, filesystem, expectedMessages }) => {
  const collectedMessages = [];
  for (const { messages } of await runEsLint(filePath, filesystem)) {
    for (const { message } of messages) {
      collectedMessages.push(message);
    }
  }

  const fsText = JSON.stringify(filesystem);

  const produced = `\n${caseName}\n-----\n${fsText}\n-----\n${collectedMessages.join('\n')}\n`;
  const expected = `\n${caseName}\n-----\n${fsText}\n-----\n${expectedMessages.join('\n')}\n`;

  t.is(produced, expected);
};

test('Test Cases', async (t) => {
  for (const { caseName, filePath, filesystem, expectedMessages } of (await readTestCases('test_cases.txt'))) {
    if (filePath) {
      await lint({ t, caseName, filePath, filesystem, expectedMessages });
    }
  }
});
