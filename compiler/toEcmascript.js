import { generate } from './astring.js';
import hash from 'object-hash';
import { parse } from 'acorn/dist/acorn.mjs';
import { read } from '@jsxcad/sys';
import { recursive } from 'acorn-walk/dist/walk.mjs';

// FIX: ArrowFunction parameters can be picked up as dependencies.

const parseOptions = {
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
  sourceType: 'module',
  locations: true,
};

export const strip = (ast) => {
  if (ast instanceof Array) {
    return ast.map(strip);
  } else if (ast instanceof Object) {
    const stripped = {};
    for (const key of Object.keys(ast)) {
      if (!['end', 'loc', 'start', 'parent'].includes(key)) {
        stripped[key] = strip(ast[key]);
      }
    }
    return stripped;
  } else {
    return ast;
  }
};

const collectDependencies = (declarator) => {
  const dependencies = [];

  const Identifier = (node, state, c) => {
    dependencies.push(node.name);
  };

  recursive(declarator, undefined, { Identifier });

  return dependencies;
};

const fromIdToSha = (id, { topLevel }) => {
  const entry = topLevel.get(id);
  if (entry !== undefined) {
    return entry.sha;
  }
};

const generateCacheLoadCode = async ({
  isNotCacheable,
  code,
  path,
  id,
  doReplay = false,
}) => {
  const loadCode = [];
  if (!isNotCacheable) {
    const meta = await read(`meta/def/${path}/${id}`);
    console.log(
      `QQ/generateCacheLoadCode: meta/def/${path}/${id} = ${JSON.stringify(
        meta
      )}`
    );
    if (meta && meta.type === 'Shape') {
      console.log(`QQ/generateCacheLoadCode/load`);
      loadCode.push(
        parse(
          `const ${id} = await loadGeometry('data/def/${path}/${id}')`,
          parseOptions
        ),
        parse(`Object.freeze(${id});`, parseOptions)
      );
      if (doReplay) {
        loadCode.push(
          parse(
            `pushSourceLocation({ path: '${path}', id: '${id}' });`,
            parseOptions
          )
        );
        loadCode.push(
          parse(`await replayRecordedNotes('${path}', '${id}')`, parseOptions)
        );
        loadCode.push(
          parse(
            `popSourceLocation({ path: '${path}', id: '${id}' });`,
            parseOptions
          )
        );
      }
      return loadCode;
    }
  }
  // Otherwise recompute it.
  loadCode.push(
    parse(`pushSourceLocation({ path: '${path}', id: '${id}' });`, parseOptions)
  );
  loadCode.push(...code);
  loadCode.push(
    parse(`popSourceLocation({ path: '${path}', id: '${id}' });`, parseOptions)
  );
  return loadCode;
};

const generateUpdateCode = async (
  { isNotCacheable, code, dependencies, path, id },
  { declaration, sha, topLevel, state }
) => {
  if (isNotCacheable) {
    return `
try {
pushSourceLocation({ path: '${path}', id: '${id}' });
${code.map((statement) => generate(statement)).join('\n')}
popSourceLocation({ path: '${path}', id: '${id}' });
} catch (error) { throw error; }
`;
  }

  const body = [];
  const seen = new Set();
  const walk = async (dependencies) => {
    for (const dependency of dependencies) {
      if (seen.has(dependency)) {
        continue;
      }
      seen.add(dependency);
      const entry = topLevel.get(dependency);
      if (entry === undefined) {
        continue;
      }
      await walk(entry.dependencies);
      body.push(...(await generateCacheLoadCode(entry)));
    }
  };
  await walk(dependencies);
  body.push(parse(`info('define ${id}');`, parseOptions));
  body.push(
    parse(
      `pushSourceLocation({ path: '${path}', id: '${id}' }); beginRecordingNotes('${path}', '${id}', { line: ${declaration.loc.start.line}, column: ${declaration.loc.start.column} });`,
      parseOptions
    )
  );
  body.push(...code);
  // Only cache Shapes.
  body.push(
    parse(
      `await write('meta/def/${path}/${id}', { sha: '${sha}', type: ${id} instanceof Shape ? 'Shape' : 'Object' });
       if (${id} instanceof Shape) { await saveGeometry('data/def/${path}/${id}', ${id}); }`,
      parseOptions
    )
  );
  body.push(
    parse(
      `await saveRecordedNotes('${path}', '${id}'); popSourceLocation({ path: '${path}', id: '${id}' });`,
      parseOptions
    )
  );
  const program = { type: 'Program', body };
  return `
try {
${generate(program)}
} catch (error) { throw error; }
`;
};

const fixControlCalls = (declarator, controls) => {
  if (
    declarator.init &&
    declarator.init.type === 'CallExpression' &&
    declarator.init.callee.type === 'Identifier' &&
    declarator.init.callee.name === 'control'
  ) {
    const [label, value] = declarator.init.arguments;
    let controlValue = controls[label.value];
    if (controlValue !== undefined) {
      // FIX: Let check these are valid.
      switch (typeof value.value) {
        case 'string':
          // FIX: Quotes
          value.raw = `'${controlValue}'`;
          value.value = String(controlValue);
          break;
        default:
          value.raw = `${controlValue}`;
          value.value = controlValue;
      }
    }
  }
};

const declareVariable = async (
  declaration,
  declarator,
  {
    path,
    updates,
    controls,
    exportNames,
    out,
    doExport = false,
    isImport = false,
    topLevel,
    sourceLocation,
  } = {}
) => {
  fixControlCalls(declarator, controls);

  const id = declarator.id.name;

  // pushSourceLocation({ path: '${path}', id: '${id}' });

  const code = parse(
    `
      ${generate({
        type: 'VariableDeclaration',
        kind: declaration.kind,
        declarations: [strip(declarator)],
      })}
    `,
    parseOptions
  ).body;

  // popSourceLocation();

  const dependencies = collectDependencies(declarator);
  const dependencyShas = dependencies.map((dependency) =>
    fromIdToSha(dependency, { topLevel })
  );
  const definition = { code, dependencies, dependencyShas };
  const sha = hash(definition);

  const entry = {
    path,
    id,
    code,
    definition,
    dependencies,
    sha,
    sourceLocation: sourceLocation || declaration.loc,
  };

  topLevel.set(id, entry);

  if (doExport) {
    exportNames.push(id);
  }

  // Bail out for special cases.
  if (declarator.init) {
    if (declarator.init.loc) {
      entry.initSourceLocation = sourceLocation || declarator.init.loc;
    }
    if (declarator.init.type === 'ArrowFunctionExpression') {
      // We can't cache functions.
      entry.isNotCacheable = true;
    } else if (
      declarator.init.type === 'Literal' ||
      declarator.init.type === 'ObjectExpression'
    ) {
      // Not much point in caching literals.
      entry.isNotCacheable = true;
    } else if (
      declarator.init.type === 'CallExpression' &&
      declarator.init.callee.type === 'Identifier' &&
      declarator.init.callee.name === 'control'
    ) {
      // We've already patched this.
      entry.isNotCacheable = true;
    } else if (isImport) {
      // We need to import from modules during replay.
      entry.isNotCacheable = true;
    }
  }

  // parse(`emitSourceLocation( importModule('${source.value}');`, parseOptions),
  out.push(...(await generateCacheLoadCode({ ...entry, doReplay: true })));

  if (!entry.isNotCacheable) {
    const meta = await read(`meta/def/${path}/${id}`);
    if (!meta || meta.sha !== sha) {
      updates[id] = {
        dependencies,
        program: await generateUpdateCode(entry, {
          declaration,
          sha,
          topLevel,
        }),
      };
    }
  }
};

const processStatement = async (
  entry,
  {
    out,
    updates,
    exportNames,
    path,
    controls,
    topLevel,
    nextTopLevelExpressionId,
    isImport,
    sourceLocation,
  }
) => {
  if (entry.type === 'ImportDeclaration') {
    // Rewrite
    //   import { foo } from 'bar';
    //   import Foo from 'bar';
    // to
    //   const { foo } = (await importModule('bar')).foo;
    //   const Foo = (await importModule('bar')).default;
    //
    // FIX: Handle other variations.
    const { specifiers, source } = entry;

    if (specifiers.length === 0) {
      processProgram(
        parse(`await importModule('${source.value}');`, parseOptions),
        {
          out,
          updates,
          exportNames,
          path,
          controls,
          topLevel,
          nextTopLevelExpressionId,
          isImport: true,
          sourceLocation: entry.loc,
        }
      );
    } else {
      for (const { imported, local, type } of specifiers) {
        switch (type) {
          case 'ImportDefaultSpecifier':
            processProgram(
              parse(
                `const ${local.name} = (await importModule('${source.value}')).default;`,
                parseOptions
              ),
              {
                out,
                updates,
                exportNames,
                path,
                controls,
                topLevel,
                nextTopLevelExpressionId,
                isImport: true,
                sourceLocation: entry.loc,
              }
            );
            break;
          case 'ImportSpecifier':
            if (local.name !== imported.name) {
              processProgram(
                parse(
                  `const ${local.name} = (await importModule('${source.value}')).${imported.name};`,
                  parseOptions
                ),
                {
                  out,
                  updates,
                  exportNames,
                  path,
                  controls,
                  topLevel,
                  nextTopLevelExpressionId,
                  isImport: true,
                  sourceLocation: entry.loc,
                }
              );
            } else {
              processProgram(
                parse(
                  `const ${imported.name} = (await importModule('${source.value}')).${imported.name};`,
                  parseOptions
                ),
                {
                  out,
                  updates,
                  exportNames,
                  path,
                  controls,
                  topLevel,
                  nextTopLevelExpressionId,
                  isImport: true,
                  sourceLocation: entry.loc,
                }
              );
            }
            break;
        }
      }
    }
  } else if (entry.type === 'VariableDeclaration') {
    for (const declarator of entry.declarations) {
      await declareVariable(entry, declarator, {
        out,
        updates,
        exportNames,
        path,
        controls,
        topLevel,
        nextTopLevelExpressionId,
        isImport,
        sourceLocation,
      });
    }
  } else if (entry.type === 'ExportNamedDeclaration') {
    // Note the names and replace the export with the declaration.
    const declaration = entry.declaration;
    if (declaration.type === 'VariableDeclaration') {
      for (const declarator of declaration.declarations) {
        await declareVariable(entry.declaration, declarator, {
          updates,
          doExport: true,
          exportNames,
          path,
          controls,
          out,
          topLevel,
          nextTopLevelExpressionId,
          sourceLocation,
        });
      }
    }
  } else if (entry.type === 'ExpressionStatement') {
    // This is an ugly way of turning top level expressions into declarations.
    const declaration = parse(
      `const $${nextTopLevelExpressionId()} = ${generate(entry)}`,
      parseOptions
    ).body[0];
    const declarator = declaration.declarations[0];
    await declareVariable(declaration, declarator, {
      out,
      updates,
      exportNames,
      path,
      controls,
      topLevel,
      nextTopLevelExpressionId,
      isImport,
      sourceLocation: entry.loc,
    });
  } else {
    out.push(entry);
  }
};

const processProgram = async (
  program,
  {
    out,
    updates,
    exportNames,
    path,
    controls,
    isImport,
    topLevel,
    nextTopLevelExpressionId,
    sourceLocation,
  }
) => {
  for (const statement of program.body) {
    await processStatement(statement, {
      out,
      updates,
      exportNames,
      path,
      controls,
      isImport,
      topLevel,
      nextTopLevelExpressionId,
      sourceLocation,
    });
  }
};

/**
 * Convert a module to executable ecmascript function.
 * The conversion includes caching constant variables for reuse, and tree pruning.
 *
 * @param {string} script
 * @param {object} options
 * @param {string} options.path - The path to the script for producing relative paths.
 * @param {function(path:string} options.import - A method for resolving imports.
 */

export const toEcmascript = async (
  script,
  { path = '', topLevel = new Map(), updates = {} } = {}
) => {
  let ast = parse(script, parseOptions);

  let topLevelExpressionCount = 0;
  const nextTopLevelExpressionId = () => ++topLevelExpressionCount;

  const exportNames = [];

  const out = [];

  // Start by loading the controls
  const controls = (await read(`control/${path}`)) || {};

  await processProgram(ast, {
    out,
    updates,
    exportNames,
    controls,
    path,
    topLevel,
    nextTopLevelExpressionId,
  });

  // Return the exports as an object.
  out.push(parse(`return { ${exportNames.join(', ')} };`, parseOptions));

  const result = `
try {
${generate(parse(out.map(generate).join('\n'), parseOptions))}
} catch (error) { throw error; }
`;

  return result;
};
