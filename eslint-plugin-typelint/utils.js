const fs = require('fs');

const doctrine = require('doctrine');

const {
    default: parseFile
} = require('eslint-module-utils/parse');
const {
    default: resolve
} = require('eslint-module-utils/resolve');
const scan = require('scope-analyzer');

const fileInfoCache = require('./fileInfoCache.js');
const typedefCache = require('./typedefCache.js');
const { RecordType, Type, TypeContext, UnionType } = require('@jsxcad/typecheck');

function parseJsdocComments(programNode, context) {
    for (const statement of programNode.body) {
      if (statement.type === 'ImportDeclaration') {
        getContextForFile(statement.source.value, context);
      }
    }
    for (const comment of programNode.comments) {
      if (comment.type !== `Block` || comment.value[0] !== '*') {
        continue;
      }
      Type.parseComment(comment.loc.end.line + 1, `/*${comment.value}*/`, getTypeContext(context));
    }
}

function getTypedefs(context) {
  return typedefCache;
}

function importModule(path, context) {
  const fsPath = resolve(path, context);
  const externalContext = getContextForFile(fsPath, context);
  return getTypeContext(externalContext);
}

function acquireBinding(node) {
    switch (node.type) {
        case `Identifier`:
            return scan.getBinding(node);

        case `MemberExpression`:
            return acquireBinding(node.property);

        default:
            throw Error(`Unexpected type for acquireBinding: ${node.type} ${node}`);
    }
}

function getDefaultExportDeclaration(context) {
    const { programNode } = getFileInfo(context);

    for (const node of programNode.body) {
      if (node.type === 'ExportDefaultDeclaration') {
        return node.declaration;
      }
    }
}

function getNamedExportIdentifier(symbolName, context) {
    const { programNode } = getFileInfo(context);

    for (const node of programNode.body) {
      if (node.type !== 'ExportNamedDeclaration') {
        continue;
      }
      for (const specifier of node.specifiers) {
        if (specifier.exported.name === symbolName) {
          return specifier.local;
        }
      }
      if (node.declaration) {
        for (const declaration of node.declaration.declarations) {
          if (declaration.id.name === symbolName) {
            return declaration.id;
          }
        }
      }
    }
}

function resolveTypeForIdentifier(originalContext, node, path) {
  const context = getContextForFile(path, originalContext);
  const binding = acquireBinding(node);

  if (!binding) {
      return Type.any;
  }

  const { name } = node;
  const { definition } = binding;

  if (!definition) {
      // Look for global definitions.
      switch (node.name) {
        case 'undefined':
          return Type.undefined;
        default:
          // No idea what this is.
          return Type.any;
    }
  }

  const { parent } = definition;

  // If it is defined in a parameter, the declaration is for the function.

  switch (parent.type) {
      case `FunctionDeclaration`: {
          const parentType = Type.fromNode(parent, getTypeContext(context));
          // CHECK: How do we handle the case where the function has a parmeter with the same name as the function?
          // The correct binding would depend on if we were originally inside or not, so we can trace the parent down.
          if (parentType.hasParameter(name)) {
            return parentType.getParameter(name);
          } else {
            return parentType;
          }
      }
      case `FunctionExpression`: {
          // This should only happen for parameters.
          return Type.fromNode(parent, getTypeContext(context)).getParameter(name);
      }
      case `ArrowFunctionExpression`: {
          // This should only happen for parameters.
          return Type.fromNode(parent, getTypeContext(context)).getParameter(name);
      }
      case `ImportDefaultSpecifier`: {
          const fsPath = resolve(parent.parent.source.value, context);
          const externalContext = getContextForFile(fsPath, context);
          const declaration = getDefaultExportDeclaration(externalContext);
          if (!declaration) {
            return Type.invalid;
          }
          const type = Type.fromNode(declaration, getTypeContext(externalContext));
          return type;
      }
      case `ImportSpecifier`: {
          const externalSymbol = parent.imported.name;
          const fsPath = resolve(parent.parent.source.value, context);
          const externalContext = getContextForFile(fsPath, context);
          const identifier = getNamedExportIdentifier(externalSymbol, externalContext);
          if (!identifier) {
            return Type.invalid;
          }
          return Type.fromNode(identifier, getTypeContext(externalContext));
      }
      case `VariableDeclarator`: {
          // FIX: This should be at the Declaration level so that we can see if it is const.
          // We can infer the type of const variables from their initialization, but others might be mutated.
          // So we require an explicit declaration, which is detected above.
          return Type.fromNode(parent, getTypeContext(context));
      }
      default:
          throw Error(`Unexpected parent.type ${parent.type}`);
  }

  return Type.any;
}

function resolveType(node, context) {
  return Type.fromNode(node, getTypeContext(context));
}

function getTypeContext(context) {
    const fileInfo = getFileInfo(context);
    if (!fileInfo.typeContext) {
      fileInfo.typeContext = new TypeContext({
        typedefs: getTypedefs(context),
        // resolveTypeForIdentifier: (node, filename) => resolveTypeForIdentifier(context, node, filename),
        acquireBinding: acquireBinding,
        importModule: (path) => importModule(path, context),
        getDefaultExportDeclaration: () => getDefaultExportDeclaration(context),
        getNamedExportIdentifier: (symbolName) => getNamedExportIdentifier(symbolName, context),
        filename: context.getFilename(),
        parseComment: doctrine.parse,
        parseType: doctrine.parseType,
      });
    }
    return fileInfo.typeContext;
}

function getFileInfo(context) {
    const filename = context.getFilename();

    if (!fileInfoCache[filename]) {
      try {
        console.log(`import ${filename}.`);
        const fileContents = fs.readFileSync(filename).toString();
        const programNode = parseFile(filename, fileContents, context);
        // Adds fileInfoCache entry.
        storeProgram(programNode, context);
      } catch (e) {
        fileInfoCache[filename] = {};
        console.log(`import ${filename} failed.`);
      }
    }

    return fileInfoCache[filename];
}

function getContextForFile(fsPath, currentContext) {
    if (!fsPath.endsWith('.js')) {
      fsPath = `${fsPath}.js`;
    }

    const resolvedPath = resolve(fsPath, currentContext);

    if (resolvedPath === currentContext.getFilename()) {
      return currentContext;
    }

    const newContext = {};

    // Copy own and inherited properties.
    for (let i in currentContext) {
        newContext[i] = currentContext[i];
    }

    newContext.getFilename = () => resolvedPath;

    // Prime the cache eagerly so that typedefs are in place.
    getFileInfo(newContext);

    return newContext;
}

/**
 * @mutates
 */
function addAST(programNode) {
    scan.createScope(programNode, []);
    scan.crawl(programNode);

    return programNode;
}

function storeProgram(programNode, context) {
    addAST(programNode);
    fileInfoCache[context.getFilename()] = {
        context,
        programNode
    };
    parseJsdocComments(programNode, context);
}

/**
 * @param {Node} node
 * @param {Context} context
 * @return {Type[]}
 */
function getArgumentsForFunctionCall(node, context) {
    return node.arguments.map(arg => resolveType(arg, context));
}

function getNameOfCalledFunction(node, context) {
    if (node.type !== `CallExpression`) {
        throw Error(`Unexpected type for getNameOfCalledFunction: ${node.type}`);
    }

    switch (node.callee.type) {
        case `MemberExpression`:
            return node.callee.property.name;

        default:
            return node.callee.name;
    }
}

function getContainingFunctionDeclaration(node, context) {
    let funcDecl = node;
    while (funcDecl
           && funcDecl.type !== `FunctionDeclaration`
           && funcDecl.type !== `FunctionExpression`
           && funcDecl.type !== 'ArrowFunctionExpression') {
        funcDecl = funcDecl.parent;
    }
    return funcDecl;
}

module.exports = {
    getArgumentsForFunctionCall,
    getContainingFunctionDeclaration,
    getNameOfCalledFunction,
    resolveType,
    storeProgram
};
