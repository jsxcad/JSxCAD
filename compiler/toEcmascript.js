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

const add = (array, item) => {
  if (array.indexOf(item) === -1) {
    array.push(item);
  }
  return array;
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

const collectDependencies = (declarator, sideEffectors) => {
  const dependencies = [...sideEffectors];

  const Identifier = (node, state, c) => {
    if (!dependencies.includes(node.name)) {
      dependencies.push(node.name);
    }
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

const generateReplayCode = async (
  { isNotCacheable, importSource, emitSourceLocation = true, code, path, id },
  { doReplay = true, provideDefinition = false }
) => {
  const loadCode = [];
  if (!isNotCacheable && !importSource) {
    const meta = await read(`meta/def/${path}/${id}`);
    if (meta && meta.type === 'Shape') {
      loadCode.push(
        parse(
          `const ${id} = await loadGeometry('data/def/${path}/${id}')`,
          parseOptions
        ),
        parse(`Object.freeze(${id});`, parseOptions)
      );
      // This provides a definition.
      provideDefinition = false;
    }
  }
  if (emitSourceLocation) {
    loadCode.push(
      parse(
        `pushSourceLocation({ path: '${path}', id: '${id}' });`,
        parseOptions
      )
    );
  }
  if (doReplay) {
    loadCode.push(
      parse(`await replayRecordedNotes('${path}', '${id}')`, parseOptions)
    );
  }
  if (provideDefinition) {
    loadCode.push(...code);
  }
  // Otherwise recompute it.
  if (emitSourceLocation) {
    loadCode.push(
      parse(
        `popSourceLocation({ path: '${path}', id: '${id}' });`,
        parseOptions
      )
    );
  }
  return loadCode;
};

const generateUpdateCode = async (entry, { declaration, sha, topLevel }) => {
  const {
    doNotUpdateMetadata = false,
    isNotCacheable,
    code,
    dependencies,
    path,
    id,
    importSource,
    imports = [],
    emitSourceLocation = !importSource,
  } = entry;
  const body = [];
  const seen = new Set();
  if (importSource) {
    add(imports, importSource);
  }
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
      if (entry.importSource) {
        add(imports, entry.importSource);
      }
      body.push(
        ...(await generateReplayCode(entry, { provideDefinition: true }))
      );
    }
  };
  await walk(dependencies);
  entry.imports = imports;
  if (emitSourceLocation) {
    body.push(parse(`info('define ${id}');`, parseOptions));
    body.push(
      parse(
        `pushSourceLocation({ path: '${path}', id: '${id}' });`,
        parseOptions
      )
    );
  }
  if (!isNotCacheable && !importSource) {
    body.push(
      parse(
        `beginRecordingNotes('${path}', '${id}', { line: ${declaration.loc.start.line}, column: ${declaration.loc.start.column} });`,
        parseOptions
      )
    );
  }
  body.push(...code);
  if (!doNotUpdateMetadata) {
    body.push(
      parse(
        `await write('meta/def/${path}/${id}', { sha: '${sha}', type: ${id} instanceof Shape ? 'Shape' : 'Object' });`,
        parseOptions
      )
    );
  }
  if (!isNotCacheable && !importSource) {
    // Only cache Shapes.
    body.push(
      parse(
        `if (${id} instanceof Shape) { await saveGeometry('data/def/${path}/${id}', ${id}); }`,
        parseOptions
      )
    );
    body.push(
      parse(`await saveRecordedNotes('${path}', '${id}');`, parseOptions)
    );
  }
  if (emitSourceLocation) {
    body.push(
      parse(
        `popSourceLocation({ path: '${path}', id: '${id}' });`,
        parseOptions
      )
    );
  }
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
    replays,
    controls,
    exportNames,
    out,
    doExport = false,
    sideEffectors,
    hasSideEffects = false,
    topLevel,
    sourceLocation,
    emitSourceLocation,
    importSource,
    imports,
  } = {}
) => {
  fixControlCalls(declarator, controls);

  const id = declarator.id.name;

  if (hasSideEffects && !sideEffectors.includes(id)) {
    sideEffectors.push(id);
  }

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

  const dependencies = collectDependencies(declarator, sideEffectors);
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
    hasSideEffects,
    sourceLocation: sourceLocation || declaration.loc,
    emitSourceLocation,
    importSource,
    imports: [],
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
    } else if (importSource) {
      entry.isNotCacheable = true;
    }
  }

  if (!entry.isNotCacheable) {
    const meta = await read(`meta/def/${path}/${id}`);
    if (!meta || meta.sha !== sha) {
      updates[id] = {
        dependencies,
        imports: entry.imports,
        program: await generateUpdateCode(entry, {
          declaration,
          sha,
          topLevel,
        }),
      };
      // Don't replay it if it's being updated.
      return;
    }
  }

  const replayProgram = await generateReplayCode(
    { ...entry, isNotCacheable: true },
    { provideDefinition: false }
  );
  if (replayProgram.length > 0) {
    replays[id] = {
      dependencies,
      imports: entry.imports,
      program: `
try {
${generate({ type: 'Program', body: replayProgram })}
} catch (error) { throw error; }
`,
    };
  }
};

// FIX: Replace path with directory?
const resolveModulePath = (module, { path }) => {
  const op = () => {
    if (module.startsWith('./')) {
      const subpath = path.split('/');
      subpath.pop();
      return `${[...subpath, module.substring(2)].join('/')}`;
    } else if (module.startsWith('../')) {
      const subpath = path.split('/');
      const end = subpath.pop();
      subpath.pop();
      subpath.push(end);
      return resolveModulePath(`./${module.substring(3)}`, {
        path: subpath.join('/'),
      });
    } else {
      return module;
    }
  };

  const result = op();
  return result;
};

const processStatement = async (entry, options) => {
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
    const modulePath = resolveModulePath(source.value, options);

    if (specifiers.length === 0) {
      processProgram(
        parse(`await importModule('${modulePath}');`, parseOptions),
        {
          ...options,
          importSource: modulePath,
          hasSideEffects: true,
          sourceLocation: entry.loc,
          emitSourceLocation: false,
        }
      );
    } else {
      for (const { imported, local, type } of specifiers) {
        switch (type) {
          case 'ImportDefaultSpecifier':
            processProgram(
              parse(
                `const ${local.name} = (await importModule('${modulePath}')).default;`,
                parseOptions
              ),
              {
                ...options,
                importSource: modulePath,
                sourceLocation: entry.loc,
                emitSourceLocation: false,
              }
            );
            break;
          case 'ImportSpecifier':
            if (local.name !== imported.name) {
              processProgram(
                parse(
                  `const ${local.name} = (await importModule('${modulePath}')).${imported.name};`,
                  parseOptions
                ),
                {
                  ...options,
                  importSource: modulePath,
                  sourceLocation: entry.loc,
                  emitSourceLocation: false,
                }
              );
            } else {
              processProgram(
                parse(
                  `const ${imported.name} = (await importModule('${modulePath}')).${imported.name};`,
                  parseOptions
                ),
                {
                  ...options,
                  importSource: modulePath,
                  sourceLocation: entry.loc,
                  emitSourceLocation: false,
                }
              );
            }
            break;
        }
      }
    }
  } else if (entry.type === 'VariableDeclaration') {
    for (const declarator of entry.declarations) {
      await declareVariable(entry, declarator, options);
    }
  } else if (entry.type === 'ExportNamedDeclaration') {
    // Note the names and replace the export with the declaration.
    const declaration = entry.declaration;
    if (declaration.type === 'VariableDeclaration') {
      for (const declarator of declaration.declarations) {
        await declareVariable(entry.declaration, declarator, {
          ...options,
          doExport: true,
        });
      }
    }
  } else if (entry.type === 'ExpressionStatement') {
    const { nextTopLevelExpressionId } = options;
    // This is an ugly way of turning top level expressions into declarations.
    const declaration = parse(
      `const $${nextTopLevelExpressionId()} = ${generate(entry)}`,
      parseOptions
    ).body[0];
    const declarator = declaration.declarations[0];
    await declareVariable(declaration, declarator, {
      ...options,
      sourceLocation: entry.loc,
    });
  } else {
    const { out } = options;
    out.push(entry);
  }
};

const processProgram = async (program, options) => {
  for (const statement of program.body) {
    await processStatement(statement, options);
  }
};

export const toEcmascript = async (
  script,
  {
    path = '',
    topLevel = new Map(),
    updates = {},
    replays = {},
    exports = [],
    imports = new Map(),
    indirectImports = new Map(),
  } = {}
) => {
  let ast = parse(script, parseOptions);

  let topLevelExpressionCount = 0;
  const nextTopLevelExpressionId = () => ++topLevelExpressionCount;

  const out = [];
  const exportNames = [];
  const sideEffectors = [];

  // Start by loading the controls
  const controls = (await read(`control/${path}`)) || {};

  await processProgram(ast, {
    out,
    updates,
    replays,
    exportNames,
    controls,
    path,
    topLevel,
    nextTopLevelExpressionId,
    sideEffectors,
    exports,
    imports,
    indirectImports,
  });

  // Return the exports as an object.
  if (exportNames.length > 0) {
    const exportCode = `return { ${exportNames.join(', ')} };`;
    exports.push(
      await generateUpdateCode(
        {
          isNotCacheable: true,
          doNotUpdateMetadata: true,
          code: parse(exportCode, parseOptions).body,
          dependencies: [...exportNames, ...sideEffectors],
          id: '$exports',
          path,
          emitSourceLocation: false, // FIX: Hack for source location.
        },
        { topLevel }
      )
    );
  }
};
