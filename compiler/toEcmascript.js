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

const escape = (text) =>
  text ? `\`${text.replace(/(['"`$])/g, '\\$1')}\`` : text;

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

  const dispatch = {
    BlockStatement: (node, bound, c) => {
      const local = new Set([...bound]);
      for (const entry of node.body) {
        switch (entry.type) {
          case 'VariableDeclaration':
            for (const declarator of entry.declarations) {
              switch (declarator.type) {
                case 'VariableDeclarator':
                  recursive(declarator.id, undefined, {
                    Identifier: (node) => local.add(node.name),
                  });
                  recursive(declarator.init, local, dispatch);
                  break;
              }
            }
            break;
          case 'ForStatement':
            for (const declarator of entry.init.declarations) {
              switch (declarator.type) {
                case 'VariableDeclarator':
                  recursive(declarator.id, undefined, {
                    Identifier: (node) => local.add(node.name),
                  });
                  recursive(declarator.init, local, dispatch);
                  break;
              }
            }
            c(entry.body, local);
            break;
          default:
            c(entry, local);
            break;
        }
      }
    },
    ArrowFunctionExpression: (node, bound, c) => {
      const { params, defaults, body } = node;
      const local = new Set([...bound]);
      for (const param of params) {
        switch (param.type) {
          case 'AssignmentPattern':
            switch (param.left.type) {
              case 'ObjectPattern':
                for (const { key, value } of param.left.properties) {
                  recursive(key, undefined, {
                    Identifier: (node) => local.add(node.name),
                  });
                  recursive(value, local, dispatch);
                }
                break;
              case 'Identifier':
                recursive(param.left, undefined, {
                  Identifier: (node) => local.add(node.name),
                });
                break;
            }
            recursive(param.right, local, dispatch);
            break;
          case 'ObjectPattern':
            for (const { key, value } of param.properties) {
              recursive(key, undefined, {
                Identifier: (node) => local.add(node.name),
              });
              recursive(value, local, dispatch);
            }
            break;
          case 'Identifier':
            recursive(param, undefined, {
              Identifier: (node) => local.add(node.name),
            });
            break;
          case 'RestElement':
            recursive(param.argument, undefined, {
              Identifier: (node) => local.add(node.name),
            });
            break;
        }
      }
      if (defaults) {
        c(defaults, local);
      }
      // TODO: Capture local bindings in the body.
      if (body) {
        switch (body.type) {
          case 'BlockStatement':
            for (const entry of body.body) {
              switch (entry.type) {
                case 'VariableDeclaration':
                  for (const declarator of entry.declarations) {
                    switch (declarator.type) {
                      case 'VariableDeclarator':
                        recursive(declarator.id, undefined, {
                          Identifier: (node) => local.add(node.name),
                        });
                        break;
                    }
                  }
                  break;
              }
            }
            break;
        }
        c(body, local);
      }
    },
    Identifier: (node, local, c) => {
      if (!local.has(node.name) && !dependencies.includes(node.name)) {
        dependencies.push(node.name);
      }
    },
  };

  recursive(declarator, new Set(), dispatch);

  return dependencies;
};

const fromIdToSha = (id, { topLevel }) => {
  const entry = topLevel.get(id);
  if (entry !== undefined) {
    return entry.sha;
  }
};

const generateCode = async (
  { path, id, dependencies, imports },
  { api, topLevel, exportNames }
) => {
  const body = [];
  const seen = new Set();
  const walk = async (dependencies, depth = 0) => {
    for (const dependency of dependencies) {
      if (seen.has(dependency)) {
        continue;
      }
      seen.add(dependency);
      const entry = topLevel.get(dependency);
      if (entry === undefined) {
        // FIX: $exports.
        if (api.hasOwnProperty(dependency) || dependency === '$exports') {
          continue;
        } else {
          throw Error(`Unbound variable: ${dependency}`);
        }
      }
      await walk(entry.dependencies, depth + 1);
      if (entry.importSource) {
        add(imports, entry.importSource);
      }
      const { path, id, code, text, sha, sourceLocation } = entry;
      const line = sourceLocation.start.line;
      if (code) {
        body.push(
          parse(
            `const ${id} = await $run(async () => { ${generate({
              type: 'Program',
              body: code,
            })}; return ${id}; }, { path: '${path}', id: '${id}', text: ${escape(
              text
            )}, sha: '${sha}', line: ${line} });`,
            parseOptions
          )
        );
      }
    }
  };
  await walk([id, ...dependencies]);
  if (exportNames) {
    body.push(parse(`return { ${exportNames.join(', ')} };`, parseOptions));
  }
  return `
try {
${generate({ type: 'Program', body })}
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
    api,
    path,
    updates,
    replays,
    controls,
    exportNames,
    lines,
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

  const declarationSource = generate({
    type: 'VariableDeclaration',
    kind: declaration.kind,
    declarations: [strip(declarator)],
  });

  const code = parse(declarationSource, parseOptions).body;

  const dependencies = collectDependencies(declarator, sideEffectors);
  const dependencyShas = dependencies.map((dependency) =>
    fromIdToSha(dependency, { topLevel })
  );

  const entry = {
    path,
    id,
    code,
    // definition,
    dependencies,
    hasSideEffects,
    sourceLocation: sourceLocation || declaration.loc,
    emitSourceLocation,
    importSource,
    imports: [],
    sha: hash({ declarationSource, dependencyShas }),
  };

  if (lines) {
    entry.text = lines
      .slice(entry.sourceLocation.start.line - 1, entry.sourceLocation.end.line)
      .join('\n');
  }

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

  updates[id] = {
    dependencies,
    imports: entry.imports,
    generateProgram: () => generateCode(entry, { api, topLevel }),
  };
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
  for (const key of Object.keys(options.updates)) {
    if (!options.updates.hasOwnProperty(key)) {
      continue;
    }
    const update = options.updates[key];
    if (update.generateProgram) {
      try {
        update.program = await update.generateProgram();
        delete update.generateProgram;
      } catch (error) {
        throw error;
      }
    }
  }
};

export const toEcmascript = async (
  script,
  {
    api = {},
    path = '',
    topLevel = new Map(),
    updates = {},
    replays = {},
    exports = [],
    imports = new Map(),
    indirectImports = new Map(),
    noLines = false,
    workspace,
  } = {}
) => {
  try {
    const lines = noLines ? undefined : script.split('\n');
    const ast = parse(script, parseOptions);

    // Start by loading the controls
    const controls = (await read(`control/${path}`, { workspace })) || {};

    // Do it twice, so that topLevel is populated.
    // FIX: Don't actually do it twice -- just populate topLevel before calling generateCode.
    {
      // Keep these local for the first run.
      let topLevelExpressionCount = 0;
      const nextTopLevelExpressionId = () => ++topLevelExpressionCount;

      const out = [];
      const exportNames = [];
      const sideEffectors = [];

      await processProgram(ast, {
        api,
        lines,
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
    }

    let topLevelExpressionCount = 0;
    const nextTopLevelExpressionId = () => ++topLevelExpressionCount;

    const out = [];
    const exportNames = [];
    const sideEffectors = [];

    await processProgram(ast, {
      api,
      lines,
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
      exports.push(
        await generateCode(
          {
            isNotCacheable: true,
            dependencies: [...exportNames, ...sideEffectors],
            id: '$exports',
            path,
            emitSourceLocation: false, // FIX: Hack for source location.
            imports: [],
          },
          { api, topLevel, exportNames }
        )
      );
    }
  } catch (error) {
    throw error;
  }
};
