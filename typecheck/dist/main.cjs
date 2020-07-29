'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// From npm astring 1.4.3 to work around node native module issue.

// Astring is a tiny and fast JavaScript code generator from an ESTree-compliant AST.
//
// Astring was written by David Bonnet and released under an MIT license.
//
// The Git repository for Astring is available at:
// https://github.com/davidbonnet/astring.git
//
// Please use the GitHub bug tracker to report issues:
// https://github.com/davidbonnet/astring/issues

const { stringify } = JSON;

/* istanbul ignore if */
if (!String.prototype.repeat) {
  /* istanbul ignore next */
  throw new Error(
    'String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation'
  );
}

/* istanbul ignore if */
if (!String.prototype.endsWith) {
  /* istanbul ignore next */
  throw new Error(
    'String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation'
  );
}

const OPERATOR_PRECEDENCE = {
  '||': 3,
  '&&': 4,
  '|': 5,
  '^': 6,
  '&': 7,
  '==': 8,
  '!=': 8,
  '===': 8,
  '!==': 8,
  '<': 9,
  '>': 9,
  '<=': 9,
  '>=': 9,
  in: 9,
  instanceof: 9,
  '<<': 10,
  '>>': 10,
  '>>>': 10,
  '+': 11,
  '-': 11,
  '*': 12,
  '%': 12,
  '/': 12,
  '**': 13,
};

// Enables parenthesis regardless of precedence
const NEEDS_PARENTHESES = 17;

const EXPRESSIONS_PRECEDENCE = {
  // Definitions
  ArrayExpression: 20,
  TaggedTemplateExpression: 20,
  ThisExpression: 20,
  Identifier: 20,
  Literal: 18,
  TemplateLiteral: 20,
  Super: 20,
  SequenceExpression: 20,
  // Operations
  MemberExpression: 19,
  CallExpression: 19,
  NewExpression: 19,
  // Other definitions
  ArrowFunctionExpression: NEEDS_PARENTHESES,
  ClassExpression: NEEDS_PARENTHESES,
  FunctionExpression: NEEDS_PARENTHESES,
  ObjectExpression: NEEDS_PARENTHESES,
  // Other operations
  UpdateExpression: 16,
  UnaryExpression: 15,
  BinaryExpression: 14,
  LogicalExpression: 13,
  ConditionalExpression: 4,
  AssignmentExpression: 3,
  AwaitExpression: 2,
  YieldExpression: 2,
  RestElement: 1,
};

function formatSequence(state, nodes) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state;
  state.write('(');
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state);
    const { length } = nodes;
    for (let i = 1; i < length; i++) {
      const param = nodes[i];
      state.write(', ');
      generator[param.type](param, state);
    }
  }
  state.write(')');
}

function expressionNeedsParenthesis(node, parentNode, isRightHand) {
  const nodePrecedence = EXPRESSIONS_PRECEDENCE[node.type];
  if (nodePrecedence === NEEDS_PARENTHESES) {
    return true;
  }
  const parentNodePrecedence = EXPRESSIONS_PRECEDENCE[parentNode.type];
  if (nodePrecedence !== parentNodePrecedence) {
    // Different node types
    return (
      (!isRightHand &&
        nodePrecedence === 15 &&
        parentNodePrecedence === 14 &&
        parentNode.operator === '**') ||
      nodePrecedence < parentNodePrecedence
    );
  }
  if (nodePrecedence !== 13 && nodePrecedence !== 14) {
    // Not a `LogicalExpression` or `BinaryExpression`
    return false;
  }
  if (node.operator === '**' && parentNode.operator === '**') {
    // Exponentiation operator has right-to-left associativity
    return !isRightHand;
  }
  if (isRightHand) {
    // Parenthesis are used if both operators have the same precedence
    return (
      OPERATOR_PRECEDENCE[node.operator] <=
      OPERATOR_PRECEDENCE[parentNode.operator]
    );
  }
  return (
    OPERATOR_PRECEDENCE[node.operator] <
    OPERATOR_PRECEDENCE[parentNode.operator]
  );
}

function formatBinaryExpressionPart(state, node, parentNode, isRightHand) {
  /*
  Writes into `state` a left-hand or right-hand expression `node`
  from a binary expression applying the provided `operator`.
  The `isRightHand` parameter should be `true` if the `node` is a right-hand argument.
  */
  const { generator } = state;
  if (expressionNeedsParenthesis(node, parentNode, isRightHand)) {
    state.write('(');
    generator[node.type](node, state);
    state.write(')');
  } else {
    generator[node.type](node, state);
  }
}

function reindent(state, text, indent, lineEnd) {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines = text.split('\n');
  const end = lines.length - 1;
  state.write(lines[0].trim());
  if (end > 0) {
    state.write(lineEnd);
    for (let i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd);
    }
    state.write(indent + lines[end].trim());
  }
}

function formatComments(state, comments, indent, lineEnd) {
  /*
  Writes into `state` the provided list of `comments`, with the given `indent` and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
  const { length } = comments;
  for (let i = 0; i < length; i++) {
    const comment = comments[i];
    state.write(indent);
    if (comment.type[0] === 'L') {
      // Line comment
      state.write('// ' + comment.value.trim() + '\n');
    } else {
      // Block comment
      state.write('/*');
      reindent(state, comment.value, indent, lineEnd);
      state.write('*/' + lineEnd);
    }
  }
}

function hasCallExpression(node) {
  /*
  Returns `true` if the provided `node` contains a call expression and `false` otherwise.
  */
  let currentNode = node;
  while (currentNode != null) {
    const { type } = currentNode;
    if (type[0] === 'C' && type[1] === 'a') {
      // Is CallExpression
      return true;
    } else if (type[0] === 'M' && type[1] === 'e' && type[2] === 'm') {
      // Is MemberExpression
      currentNode = currentNode.object;
    } else {
      return false;
    }
  }
}

function formatVariableDeclaration(state, node) {
  /*
  Writes into `state` a variable declaration.
  */
  const { generator } = state;
  const { declarations } = node;
  state.write(node.kind + ' ');
  const { length } = declarations;
  if (length > 0) {
    generator.VariableDeclarator(declarations[0], state);
    for (let i = 1; i < length; i++) {
      state.write(', ');
      generator.VariableDeclarator(declarations[i], state);
    }
  }
}

let ForInStatement,
  FunctionDeclaration,
  RestElement,
  BinaryExpression,
  ArrayExpression,
  BlockStatement;

const baseGenerator = {
  Program(node, state) {
    const indent = state.indent.repeat(state.indentLevel);
    const { lineEnd, writeComments } = state;
    if (writeComments && node.comments != null) {
      formatComments(state, node.comments, indent, lineEnd);
    }
    const statements = node.body;
    const { length } = statements;
    for (let i = 0; i < length; i++) {
      const statement = statements[i];
      if (writeComments && statement.comments != null) {
        formatComments(state, statement.comments, indent, lineEnd);
      }
      state.write(indent);
      this[statement.type](statement, state);
      state.write(lineEnd);
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, indent, lineEnd);
    }
  },
  BlockStatement: (BlockStatement = function (node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const statementIndent = indent + state.indent;
    state.write('{');
    const statements = node.body;
    if (statements != null && statements.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, statementIndent, lineEnd);
      }
      const { length } = statements;
      for (let i = 0; i < length; i++) {
        const statement = statements[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
      state.write(indent);
    } else {
      if (writeComments && node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, statementIndent, lineEnd);
        state.write(indent);
      }
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, statementIndent, lineEnd);
    }
    state.write('}');
    state.indentLevel--;
  }),
  ClassBody: BlockStatement,
  EmptyStatement(node, state) {
    state.write(';');
  },
  ExpressionStatement(node, state) {
    const precedence = EXPRESSIONS_PRECEDENCE[node.expression.type];
    if (
      precedence === NEEDS_PARENTHESES ||
      (precedence === 3 && node.expression.left.type[0] === 'O')
    ) {
      // Should always have parentheses or is an AssignmentExpression to an ObjectPattern
      state.write('(');
      this[node.expression.type](node.expression, state);
      state.write(')');
    } else {
      this[node.expression.type](node.expression, state);
    }
    state.write(';');
  },
  IfStatement(node, state) {
    state.write('if (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.consequent.type](node.consequent, state);
    if (node.alternate != null) {
      state.write(' else ');
      this[node.alternate.type](node.alternate, state);
    }
  },
  LabeledStatement(node, state) {
    this[node.label.type](node.label, state);
    state.write(': ');
    this[node.body.type](node.body, state);
  },
  BreakStatement(node, state) {
    state.write('break');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }
    state.write(';');
  },
  ContinueStatement(node, state) {
    state.write('continue');
    if (node.label != null) {
      state.write(' ');
      this[node.label.type](node.label, state);
    }
    state.write(';');
  },
  WithStatement(node, state) {
    state.write('with (');
    this[node.object.type](node.object, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  SwitchStatement(node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    state.indentLevel++;
    const caseIndent = indent + state.indent;
    const statementIndent = caseIndent + state.indent;
    state.write('switch (');
    this[node.discriminant.type](node.discriminant, state);
    state.write(') {' + lineEnd);
    const { cases: occurences } = node;
    const { length: occurencesCount } = occurences;
    for (let i = 0; i < occurencesCount; i++) {
      const occurence = occurences[i];
      if (writeComments && occurence.comments != null) {
        formatComments(state, occurence.comments, caseIndent, lineEnd);
      }
      if (occurence.test) {
        state.write(caseIndent + 'case ');
        this[occurence.test.type](occurence.test, state);
        state.write(':' + lineEnd);
      } else {
        state.write(caseIndent + 'default:' + lineEnd);
      }
      const { consequent } = occurence;
      const { length: consequentCount } = consequent;
      for (let i = 0; i < consequentCount; i++) {
        const statement = consequent[i];
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd);
        }
        state.write(statementIndent);
        this[statement.type](statement, state);
        state.write(lineEnd);
      }
    }
    state.indentLevel -= 2;
    state.write(indent + '}');
  },
  ReturnStatement(node, state) {
    state.write('return');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }
    state.write(';');
  },
  ThrowStatement(node, state) {
    state.write('throw ');
    this[node.argument.type](node.argument, state);
    state.write(';');
  },
  TryStatement(node, state) {
    state.write('try ');
    this[node.block.type](node.block, state);
    if (node.handler) {
      const { handler } = node;
      if (handler.param == null) {
        state.write(' catch ');
      } else {
        state.write(' catch (');
        this[handler.param.type](handler.param, state);
        state.write(') ');
      }
      this[handler.body.type](handler.body, state);
    }
    if (node.finalizer) {
      state.write(' finally ');
      this[node.finalizer.type](node.finalizer, state);
    }
  },
  WhileStatement(node, state) {
    state.write('while (');
    this[node.test.type](node.test, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  DoWhileStatement(node, state) {
    state.write('do ');
    this[node.body.type](node.body, state);
    state.write(' while (');
    this[node.test.type](node.test, state);
    state.write(');');
  },
  ForStatement(node, state) {
    state.write('for (');
    if (node.init != null) {
      const { init } = node;
      if (init.type[0] === 'V') {
        formatVariableDeclaration(state, init);
      } else {
        this[init.type](init, state);
      }
    }
    state.write('; ');
    if (node.test) {
      this[node.test.type](node.test, state);
    }
    state.write('; ');
    if (node.update) {
      this[node.update.type](node.update, state);
    }
    state.write(') ');
    this[node.body.type](node.body, state);
  },
  ForInStatement: (ForInStatement = function (node, state) {
    state.write(`for ${node.await ? 'await ' : ''}(`);
    const { left } = node;
    if (left.type[0] === 'V') {
      formatVariableDeclaration(state, left);
    } else {
      this[left.type](left, state);
    }
    // Identifying whether node.type is `ForInStatement` or `ForOfStatement`
    state.write(node.type[3] === 'I' ? ' in ' : ' of ');
    this[node.right.type](node.right, state);
    state.write(') ');
    this[node.body.type](node.body, state);
  }),
  ForOfStatement: ForInStatement,
  DebuggerStatement(node, state) {
    state.write('debugger;' + state.lineEnd);
  },
  FunctionDeclaration: (FunctionDeclaration = function (node, state) {
    state.write(
      (node.async ? 'async ' : '') +
        (node.generator ? 'function* ' : 'function ') +
        (node.id ? node.id.name : ''),
      node
    );
    formatSequence(state, node.params);
    state.write(' ');
    this[node.body.type](node.body, state);
  }),
  FunctionExpression: FunctionDeclaration,
  VariableDeclaration(node, state) {
    formatVariableDeclaration(state, node);
    state.write(';');
  },
  VariableDeclarator(node, state) {
    this[node.id.type](node.id, state);
    if (node.init != null) {
      state.write(' = ');
      this[node.init.type](node.init, state);
    }
  },
  ClassDeclaration(node, state) {
    state.write('class ' + (node.id ? `${node.id.name} ` : ''), node);
    if (node.superClass) {
      state.write('extends ');
      this[node.superClass.type](node.superClass, state);
      state.write(' ');
    }
    this.ClassBody(node.body, state);
  },
  ImportDefaultSpecifier(node, state) {
    state.write('<ImportDefaultSpecifier>');
  },
  ImportSpecifier(node, state) {
    state.write('<ImportSpecifier>');
  },
  ImportDeclaration(node, state) {
    state.write('import ');
    const { specifiers } = node;
    const { length } = specifiers;
    // NOTE: Once babili is fixed, put this after condition
    // https://github.com/babel/babili/issues/430
    let i = 0;
    if (length > 0) {
      for (; i < length; ) {
        if (i > 0) {
          state.write(', ');
        }
        const specifier = specifiers[i];
        const type = specifier.type[6];
        if (type === 'D') {
          // ImportDefaultSpecifier
          state.write(specifier.local.name, specifier);
          i++;
        } else if (type === 'N') {
          // ImportNamespaceSpecifier
          state.write('* as ' + specifier.local.name, specifier);
          i++;
        } else {
          // ImportSpecifier
          break;
        }
      }
      if (i < length) {
        state.write('{');
        for (;;) {
          const specifier = specifiers[i];
          const { name } = specifier.imported;
          state.write(name, specifier);
          if (name !== specifier.local.name) {
            state.write(' as ' + specifier.local.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
        state.write('}');
      }
      state.write(' from ');
    }
    this.Literal(node.source, state);
    state.write(';');
  },
  ExportDefaultDeclaration(node, state) {
    state.write('export default ');
    this[node.declaration.type](node.declaration, state);
    if (
      EXPRESSIONS_PRECEDENCE[node.declaration.type] &&
      node.declaration.type[0] !== 'F'
    ) {
      // All expression nodes except `FunctionExpression`
      state.write(';');
    }
  },
  ExportNamedDeclaration(node, state) {
    state.write('export ');
    if (node.declaration) {
      this[node.declaration.type](node.declaration, state);
    } else {
      state.write('{');
      const { specifiers } = node;
      const { length } = specifiers;
      if (length > 0) {
        for (let i = 0; ; ) {
          const specifier = specifiers[i];
          const { name } = specifier.local;
          state.write(name, specifier);
          if (name !== specifier.exported.name) {
            state.write(' as ' + specifier.exported.name);
          }
          if (++i < length) {
            state.write(', ');
          } else {
            break;
          }
        }
      }
      state.write('}');
      if (node.source) {
        state.write(' from ');
        this.Literal(node.source, state);
      }
      state.write(';');
    }
  },
  ExportAllDeclaration(node, state) {
    state.write('export * from ');
    this.Literal(node.source, state);
    state.write(';');
  },
  MethodDefinition(node, state) {
    if (node.static) {
      state.write('static ');
    }
    const kind = node.kind[0];
    if (kind === 'g' || kind === 's') {
      // Getter or setter
      state.write(node.kind + ' ');
    }
    if (node.value.async) {
      state.write('async ');
    }
    if (node.value.generator) {
      state.write('*');
    }
    if (node.computed) {
      state.write('[');
      this[node.key.type](node.key, state);
      state.write(']');
    } else {
      this[node.key.type](node.key, state);
    }
    formatSequence(state, node.value.params);
    state.write(' ');
    this[node.value.body.type](node.value.body, state);
  },
  ClassExpression(node, state) {
    this.ClassDeclaration(node, state);
  },
  ArrowFunctionExpression(node, state) {
    state.write(node.async ? 'async ' : '', node);
    const { params } = node;
    if (params != null) {
      // Omit parenthesis if only one named parameter
      if (params.length === 1 && params[0].type[0] === 'I') {
        // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is `Identifier`
        state.write(params[0].name, params[0]);
      } else {
        formatSequence(state, node.params);
      }
    }
    state.write(' => ');
    if (node.body.type[0] === 'O') {
      // Body is an object expression
      state.write('(');
      this.ObjectExpression(node.body, state);
      state.write(')');
    } else {
      if (typeof this[node.body.type] !== 'function') {
        console.log(
          `QQ/Unsupported arrow function body type [${node.body.type}]`
        );
      }
      this[node.body.type](node.body, state);
    }
  },
  ThisExpression(node, state) {
    state.write('this', node);
  },
  Super(node, state) {
    state.write('super', node);
  },
  RestElement: (RestElement = function (node, state) {
    state.write('...');
    this[node.argument.type](node.argument, state);
  }),
  SpreadElement: RestElement,
  YieldExpression(node, state) {
    state.write(node.delegate ? 'yield*' : 'yield');
    if (node.argument) {
      state.write(' ');
      this[node.argument.type](node.argument, state);
    }
  },
  AwaitExpression(node, state) {
    state.write('await ');
    if (node.argument) {
      this[node.argument.type](node.argument, state);
    }
  },
  TemplateLiteral(node, state) {
    const { quasis, expressions } = node;
    state.write('`');
    const { length } = expressions;
    for (let i = 0; i < length; i++) {
      const expression = expressions[i];
      this.TemplateElement(quasis[i], state);
      state.write('${');
      this[expression.type](expression, state);
      state.write('}');
    }
    state.write(quasis[quasis.length - 1].value.raw);
    state.write('`');
  },
  TemplateElement(node, state) {
    state.write(node.value.raw);
  },
  TaggedTemplateExpression(node, state) {
    this[node.tag.type](node.tag, state);
    this[node.quasi.type](node.quasi, state);
  },
  ArrayExpression: (ArrayExpression = function (node, state) {
    state.write('[');
    if (node.elements.length > 0) {
      const { elements } = node;
      const { length } = elements;
      for (let i = 0; ; ) {
        const element = elements[i];
        if (element != null) {
          this[element.type](element, state);
        }
        if (++i < length) {
          state.write(', ');
        } else {
          if (element == null) {
            state.write(', ');
          }
          break;
        }
      }
    }
    state.write(']');
  }),
  ArrayPattern: ArrayExpression,
  ObjectExpression(node, state) {
    const indent = state.indent.repeat(state.indentLevel++);
    const { lineEnd, writeComments } = state;
    const propertyIndent = indent + state.indent;
    state.write('{');
    if (node.properties.length > 0) {
      state.write(lineEnd);
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, propertyIndent, lineEnd);
      }
      const comma = ',' + lineEnd;
      const { properties } = node;
      const { length } = properties;
      for (let i = 0; ; ) {
        const property = properties[i];
        if (writeComments && property.comments != null) {
          formatComments(state, property.comments, propertyIndent, lineEnd);
        }
        state.write(propertyIndent);
        if (typeof this[property.type] !== 'function') {
          console.log(`QQ/Unsupported property type [${property.type}]`);
        }
        this[property.type](property, state);
        if (++i < length) {
          state.write(comma);
        } else {
          break;
        }
      }
      state.write(lineEnd);
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
      }
      state.write(indent + '}');
    } else if (writeComments) {
      if (node.comments != null) {
        state.write(lineEnd);
        formatComments(state, node.comments, propertyIndent, lineEnd);
        if (node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        }
        state.write(indent + '}');
      } else if (node.trailingComments != null) {
        state.write(lineEnd);
        formatComments(state, node.trailingComments, propertyIndent, lineEnd);
        state.write(indent + '}');
      } else {
        state.write('}');
      }
    } else {
      state.write('}');
    }
    state.indentLevel--;
  },
  Property(node, state) {
    if (node.method || node.kind[0] !== 'i') {
      // Either a method or of kind `set` or `get` (not `init`)
      this.MethodDefinition(node, state);
    } else {
      if (!node.shorthand) {
        if (node.computed) {
          state.write('[');
          this[node.key.type](node.key, state);
          state.write(']');
        } else {
          this[node.key.type](node.key, state);
        }
        state.write(': ');
      }
      this[node.value.type](node.value, state);
    }
  },
  ObjectPattern(node, state) {
    state.write('{');
    if (node.properties.length > 0) {
      const { properties } = node;
      const { length } = properties;
      for (let i = 0; ; ) {
        this[properties[i].type](properties[i], state);
        if (++i < length) {
          state.write(', ');
        } else {
          break;
        }
      }
    }
    state.write('}');
  },
  SequenceExpression(node, state) {
    formatSequence(state, node.expressions);
  },
  UnaryExpression(node, state) {
    if (node.prefix) {
      state.write(node.operator);
      if (node.operator.length > 1) {
        state.write(' ');
      }
      if (
        EXPRESSIONS_PRECEDENCE[node.argument.type] <
        EXPRESSIONS_PRECEDENCE.UnaryExpression
      ) {
        state.write('(');
        this[node.argument.type](node.argument, state);
        state.write(')');
      } else {
        this[node.argument.type](node.argument, state);
      }
    } else {
      // FIXME: This case never occurs
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  UpdateExpression(node, state) {
    // Always applied to identifiers or members, no parenthesis check needed
    if (node.prefix) {
      state.write(node.operator);
      this[node.argument.type](node.argument, state);
    } else {
      this[node.argument.type](node.argument, state);
      state.write(node.operator);
    }
  },
  AssignmentExpression(node, state) {
    this[node.left.type](node.left, state);
    state.write(' ' + node.operator + ' ');
    this[node.right.type](node.right, state);
  },
  AssignmentPattern(node, state) {
    this[node.left.type](node.left, state);
    state.write(' = ');
    this[node.right.type](node.right, state);
  },
  BinaryExpression: (BinaryExpression = function (node, state) {
    const isIn = node.operator === 'in';
    if (isIn) {
      // Avoids confusion in `for` loops initializers
      state.write('(');
    }
    formatBinaryExpressionPart(state, node.left, node, false);
    state.write(' ' + node.operator + ' ');
    formatBinaryExpressionPart(state, node.right, node, true);
    if (isIn) {
      state.write(')');
    }
  }),
  LogicalExpression: BinaryExpression,
  ConditionalExpression(node, state) {
    if (
      EXPRESSIONS_PRECEDENCE[node.test.type] >
      EXPRESSIONS_PRECEDENCE.ConditionalExpression
    ) {
      this[node.test.type](node.test, state);
    } else {
      state.write('(');
      this[node.test.type](node.test, state);
      state.write(')');
    }
    state.write(' ? ');
    this[node.consequent.type](node.consequent, state);
    state.write(' : ');
    this[node.alternate.type](node.alternate, state);
  },
  NewExpression(node, state) {
    state.write('new ');
    if (
      EXPRESSIONS_PRECEDENCE[node.callee.type] <
        EXPRESSIONS_PRECEDENCE.CallExpression ||
      hasCallExpression(node.callee)
    ) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }
    formatSequence(state, node['arguments']);
  },
  CallExpression(node, state) {
    if (
      EXPRESSIONS_PRECEDENCE[node.callee.type] <
      EXPRESSIONS_PRECEDENCE.CallExpression
    ) {
      state.write('(');
      this[node.callee.type](node.callee, state);
      state.write(')');
    } else {
      this[node.callee.type](node.callee, state);
    }
    formatSequence(state, node['arguments']);
  },
  MemberExpression(node, state) {
    if (
      EXPRESSIONS_PRECEDENCE[node.object.type] <
      EXPRESSIONS_PRECEDENCE.MemberExpression
    ) {
      state.write('(');
      this[node.object.type](node.object, state);
      state.write(')');
    } else {
      this[node.object.type](node.object, state);
    }
    if (node.computed) {
      state.write('[');
      this[node.property.type](node.property, state);
      state.write(']');
    } else {
      state.write('.');
      this[node.property.type](node.property, state);
    }
  },
  MetaProperty(node, state) {
    state.write(node.meta.name + '.' + node.property.name, node);
  },
  Identifier(node, state) {
    state.write(node.name, node);
  },
  Literal(node, state) {
    if (node.raw != null) {
      state.write(node.raw, node);
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state);
    } else {
      state.write(stringify(node.value), node);
    }
  },
  RegExpLiteral(node, state) {
    const { regex } = node;
    state.write(`/${regex.pattern}/${regex.flags}`, node);
  },
  ExperimentalSpreadProperty(node, state) {
    state.write('<ExperimentalSpreadProperty>', node);
  },
  OptionalCallExpression(node, state) {
    state.write('<OptionalCallExpression>', node);
  },
  JSXElement(node, state) {
    state.write('<JSXElement>', node);
  },
};

const EMPTY_OBJECT = {};

class State {
  constructor(options) {
    const setup = options == null ? EMPTY_OBJECT : options;
    this.output = '';
    // Functional options
    if (setup.output != null) {
      this.output = setup.output;
      this.write = this.writeToStream;
    } else {
      this.output = '';
    }
    this.generator = setup.generator != null ? setup.generator : baseGenerator;
    // Formating setup
    this.indent = setup.indent != null ? setup.indent : '  ';
    this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n';
    this.indentLevel =
      setup.startingIndentLevel != null ? setup.startingIndentLevel : 0;
    this.writeComments = setup.comments ? setup.comments : false;
    // Source map
    if (setup.sourceMap != null) {
      this.write =
        setup.output == null ? this.writeAndMap : this.writeToStreamAndMap;
      this.sourceMap = setup.sourceMap;
      this.line = 1;
      this.column = 0;
      this.lineEndSize = this.lineEnd.split('\n').length - 1;
      this.mapping = {
        original: null,
        generated: this,
        name: undefined,
        source: setup.sourceMap.file || setup.sourceMap._file,
      };
    }
  }

  write(code) {
    this.output += code;
  }

  writeToStream(code) {
    this.output.write(code);
  }

  writeAndMap(code, node) {
    this.output += code;
    this.map(code, node);
  }

  writeToStreamAndMap(code, node) {
    this.output.write(code);
    this.map(code, node);
  }

  map(code, node) {
    if (node != null && node.loc != null) {
      const { mapping } = this;
      mapping.original = node.loc.start;
      mapping.name = node.name;
      this.sourceMap.addMapping(mapping);
    }
    if (code.length > 0) {
      if (this.lineEndSize > 0) {
        if (code.endsWith(this.lineEnd)) {
          this.line += this.lineEndSize;
          this.column = 0;
        } else if (code[code.length - 1] === '\n') {
          // Case of inline comment
          this.line++;
          this.column = 0;
        } else {
          this.column += code.length;
        }
      } else {
        if (code[code.length - 1] === '\n') {
          // Case of inline comment
          this.line++;
          this.column = 0;
        } else {
          this.column += code.length;
        }
      }
    }
  }

  toString() {
    return this.output;
  }
}

function generate(node, options) {
  /*
  Returns a string representing the rendered code of the provided AST `node`.
  The `options` are:

  - `indent`: string to use for indentation (defaults to `␣␣`)
  - `lineEnd`: string to use for line endings (defaults to `\n`)
  - `startingIndentLevel`: indent level to start from (defaults to `0`)
  - `comments`: generate comments if `true` (defaults to `false`)
  - `output`: output stream to write the rendered code to (defaults to `null`)
  - `generator`: custom code generator (defaults to `baseGenerator`)
  */
  const state = new State(options);
  // Travel through the AST node and generate the code
  if (typeof state.generator[node.type] !== 'function') {
    console.log(`astring: Unsupported node type: ${node.type}`);
  }
  state.generator[node.type](node, state);
  return state.output;
}

class TypeContext {
  constructor({
    typedefs = {},
    types = {},
    scope = { kind: 'global' },
    acquireBinding,
    getDefaultExportDeclaration,
    getNamedExportType,
    importModule,
    parseComment,
    parseType,
    filename,
  } = {}) {
    this.typedefs = typedefs;
    this.types = types;
    this.scope = scope;
    this.filename = filename;
    this.acquireBinding = acquireBinding;
    this.getDefaultExportDeclaration = getDefaultExportDeclaration;
    this.getNamedExportType = getNamedExportType;
    this.parseComment = parseComment;
    this.importModule = importModule;
    this.parseType = parseType;
  }

  getTypedef(name) {
    return this.typedefs[name];
  }

  setTypedef(name, type) {
    return (this.typedefs[name] = type);
  }

  getScope() {
    return this.scope;
  }

  setScope({ kind, name }) {
    this.scope = { kind, name };
  }

  setTypeDeclaration(line, type) {
    this.types[line] = type;
  }

  getTypeDeclaration(line) {
    const type = this.types[line] || Type.any;
    return type;
  }
}

function strip(string) {
  return string.replace(/\s/g, '');
}

// A base type accepts nothing.
class Type {
  isOfType(otherType) {
    return false;
  }

  isSupertypeOf(otherType) {
    return false;
  }

  getPropertyNames() {
    return [];
  }

  getProperty(name) {
    return Type.any;
  }

  getReturn() {
    return Type.any;
  }

  getArgumentCount() {
    return undefined;
  }

  getArgument(index) {
    return Type.any;
  }

  getParameter(name) {
    return Type.any;
  }

  hasParameter(name) {
    return false;
  }

  toString() {
    return '<invalid>';
  }

  instanceOf(kind) {
    return this instanceof kind;
  }

  is(otherType) {
    return this === otherType;
  }

  getPrimitive() {
    return undefined;
  }

  getElement() {
    return Type.any;
  }

  specializeForCall() {
    return this;
  }
}

class AnyType extends Type {
  // * can violate any type other than * or ?.
  isOfType(otherType) {
    return otherType === Type.any;
  }

  toString() {
    return '*';
  }

  isSupertypeOf(otherType) {
    return true;
  }

  // It might be an object with properties.
  getProperty(name) {
    return Type.any;
  }

  // It might be a function that returns something.
  getReturn() {
    return Type.any;
  }

  // But we don't know how many arguments it wants.
  getArgumentCount() {
    return undefined;
  }

  // We can't tell what it may expect.
  getArgument(index) {
    return Type.any;
  }
}

/**
 * The Wild type ? matches any type constraint.
 */
class WildType extends Type {
  // ? satisfies all types.
  isOfType(otherType) {
    return true;
  }

  toString() {
    return '?';
  }

  isSupertypeOf(otherType) {
    return true;
  }

  // It might be an object with properties.
  getProperty(name) {
    return Type.wild;
  }

  // It might be a function that returns something.
  getReturn() {
    return Type.wild;
  }

  // But we don't know how many arguments it wants.
  getArgumentCount() {
    return undefined;
  }

  // We can't tell what it may expect.
  getArgument(index) {
    return Type.wild;
  }
}

class SimpleType extends Type {}

// A primitive type accepts only itself.
class PrimitiveType extends SimpleType {
  constructor(primitive) {
    super();
    // Remove spaces to normalize.
    this.primitive = strip(primitive);
  }

  toString() {
    return this.primitive;
  }

  isOfType(otherType) {
    if (otherType.instanceOf(PrimitiveType)) {
      return this.getPrimitive() === otherType.getPrimitive();
    } else {
      // We don't understand this relationship. Invert it.
      return otherType.isSupertypeOf(this);
    }
  }

  isSupertypeOf(otherType) {
    if (otherType.instanceOf(PrimitiveType)) {
      return this.getPrimitive() === otherType.getPrimitive();
    } else {
      // We don't understand this relationship. Invert it.
      return otherType.isOfType(this);
    }
  }

  getPrimitive() {
    return this.primitive;
  }
}

PrimitiveType.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  switch (type.type) {
    case 'NameExpression':
      // TODO: Whitelist?
      const typedef = typeContext.getTypedef(type.name);
      if (typedef) {
        if (
          typedef.instanceOf(AliasType) &&
          typedef.getAliasName() === type.name
        ) {
          // Reuse the existing alias.
          return typedef;
        } else {
          // Establish a new alias.
          return new AliasType(type.name, typedef);
        }
      } else if (type.name === '?') {
        return Type.wild;
      } else {
        return new PrimitiveType(type.name);
      }
    case 'UndefinedLiteral':
      return Type.undefined;
    default:
      throw Error(`Unexpected type: ${type.type}`);
  }
};

// An alias is a reference to another type, ala typedef.
class AliasType extends Type {
  constructor(name, type) {
    super();
    this.name = name;
    this.type = type;
  }

  getAliasName() {
    return this.name;
  }

  // Rebinding aliases is used internally for recursive type definition.
  rebindAliasType(type) {
    this.type = type;
  }

  toString() {
    return this.name;
  }

  isOfType(otherType) {
    return this.type.isOfType(otherType);
  }

  isSupertypeOf(otherType) {
    return this.type.isSupertypeOf(otherType);
  }

  getPropertyNames() {
    return this.type.getPropertyNames();
  }

  getProperty(name) {
    return this.type.getProperty(name);
  }

  getElement() {
    return this.type.getElement();
  }

  getReturn() {
    return this.type.getReturn();
  }

  getArgumentCount() {
    return this.type.getArgumentCount();
  }

  getArgument(index) {
    return this.type.getArgument(index);
  }

  getParameter(name) {
    return this.type.getParameter(name);
  }

  hasParameter(name) {
    return this.type.hasParameter(name);
  }

  instanceOf(kind) {
    return this.type instanceof kind;
  }

  is(otherType) {
    return this.type.is(otherType);
  }
}

// A union type accepts any type in its set.
class UnionType extends Type {
  constructor(...union) {
    super();
    this.union = union;
  }

  /**
   * @description returns true if this Type describes an allowed value for 'otherType'
   * @param {Type} otherType
   * @return {boolean}
   */
  isOfType(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    for (const type of this.union) {
      if (!type.isOfType(otherType)) {
        return false;
      }
    }
    return true;
  }

  isSupertypeOf(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    for (const type of this.union) {
      if (type.isSupertypeOf(otherType)) {
        return true;
      }
    }
    return false;
  }

  toString() {
    return `(${this.union.map((type) => type.toString()).join('|')})`;
  }
}

UnionType.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  return new UnionType(
    ...type.elements.map((element) =>
      Type.fromDoctrineType(element, {}, typeContext)
    )
  );
};

// A record type accepts any record type whose properties are accepted by all of its properties.
class RecordType extends SimpleType {
  constructor(record) {
    super();
    this.record = record;
  }

  getPropertyNames() {
    return Object.keys(this.record);
  }

  getProperty(name) {
    if (this.record.hasOwnProperty(name)) {
      return this.record[name];
    } else {
      return Type.any;
    }
  }

  /**
   * @description returns true if this Type describes an allowed value for 'otherType'
   * @param {Type} otherType
   * @return {boolean}
   */
  isOfType(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (otherType.instanceOf(PrimitiveType)) {
      return false;
    }
    if (!otherType.instanceOf(RecordType)) {
      // We don't understand this relationship, so invert it.
      return otherType.isSupertypeOf(this);
    }
    for (const name of otherType.getPropertyNames()) {
      if (!this.getProperty(name).isOfType(otherType.getProperty(name))) {
        return false;
      }
    }
    return true;
  }

  isSupertypeOf(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (otherType.instanceOf(PrimitiveType)) {
      return false;
    }
    if (!otherType.instanceOf(RecordType)) {
      // We don't understand this relationship, so invert it.
      return otherType.isOfType(this);
    }
    for (const name of this.getPropertyNames()) {
      if (!this.getProperty(name).isSupertypeOf(otherType.getProperty(name))) {
        return false;
      }
    }
    return true;
  }

  toString() {
    return `{${this.getPropertyNames()
      .map((name) => `${name}:${this.getProperty(name)}`)
      .join(', ')}}`;
  }
}

RecordType.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  if (type.type === 'NameExpression' && type.name === 'object') {
    const record = {};
    for (let i = 0; i < rec.tags.length; i++) {
      const tag = rec.tags[i];
      if (tag.title === 'property') {
        record[tag.name] = Type.fromDoctrineType(tag.type, rec, typeContext);
      }
    }
    return new RecordType(record);
  }
  return Type.invalid;
};

// FIX: Handle index constraints?
class ArrayType extends SimpleType {
  constructor(element) {
    super();
    this.element = element;
  }

  getProperty(name) {
    switch (name) {
      case 'length':
        return Type.number;
      case 'map':
        // At this point we can determine that T[].map is a function(function(T):*):*[].
        const thunkType = new FunctionType(
          /* return= */ Type.any,
          /* args= */ [this.getElement()]
        );
        return new FunctionType(
          /* return= */ new ArrayType(Type.any),
          /* args= */ [thunkType],
          /* params= */ {},
          /* this= */ new ArrayType(Type.any)
        );
      // At the point of application we can narrow * further.
      // Ideally a general generics solution would be used.
      default:
        return Type.any;
    }
  }

  getElement() {
    return this.element;
  }

  /**
   * @description returns true if this Type describes an allowed value for 'otherType'
   * @param {Type} otherType
   * @return {boolean}
   */
  isOfType(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (!otherType.instanceOf(ArrayType)) {
      if (otherType.instanceOf(SimpleType)) {
        return false;
      } else {
        // We don't understand this relationship, so invert it.
        return otherType.isSupertypeOf(this);
      }
    }
    return otherType.getElement().isOfType(this.getElement());
  }

  isSupertypeOf(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (!otherType.instanceOf(ArrayType)) {
      if (otherType.instanceOf(SimpleType)) {
        return false;
      } else {
        // We don't understand this relationship, so invert it.
        return otherType.isOfType(this);
      }
    }
    return otherType.getElement().isSupertypeOf(this.getElement());
  }

  toString() {
    return `${this.element}[]`;
  }
}

ArrayType.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  // Not very clear on how TypeApplications are supposed to work, but we can start with the simple case of Foo[].
  if (
    type.expression.type === 'NameExpression' &&
    type.expression.name === 'Array'
  ) {
    if (
      type.applications.length === 1 &&
      type.applications[0].type === 'NameExpression'
    ) {
      const elementType = type.applications[0];
      return new ArrayType(Type.fromDoctrineType(elementType, {}, typeContext));
    }
  }
  return Type.invalid;
};

// A function type accepts a function whose return and parameters are accepted.
class FunctionType extends SimpleType {
  constructor(returnType, argumentTypes = [], parameterTypes = {}, thisType) {
    super();
    this.returnType = returnType;
    this.argumentTypes = argumentTypes;
    this.parameterTypes = parameterTypes;
    this.thisType = thisType;
  }

  // Specialize the function for a particular call.
  specializeForCall() {
    return this;
  }

  getReturn() {
    return this.returnType;
  }

  getArgumentCount() {
    return this.argumentTypes.length;
  }

  // Arguments are indexed and include undefined for optionals.
  // These are used for calls.
  getArgument(index) {
    return this.argumentTypes[index] || Type.invalid;
  }

  // Parameters are named and include the default value type.
  // These are used to resolve identifier bindings.
  getParameter(name) {
    return this.parameterTypes[name] || Type.any;
  }

  hasParameter(name) {
    return this.parameterTypes.hasOwnProperty(name);
  }

  isOfType(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (!otherType.instanceOf(FunctionType)) {
      if (otherType.instanceOf(SimpleType)) {
        if (otherType.getPrimitive() === 'function') {
          // The function primitive is a special case.
          return true;
        }
        return false;
      } else {
        // We don't understand this relationship, so invert it.
        return otherType.isSupertypeOf(this);
      }
    }
    if (!this.getReturn().isOfType(otherType.getReturn())) {
      return false;
    }
    const argumentCount = otherType.getArgumentCount();
    // The type relationship is upon the external argument interface.
    for (let index = 0; index < argumentCount; index++) {
      if (!otherType.getArgument(index).isOfType(this.getArgument(index))) {
        return false;
      }
    }
    return true;
  }

  isSupertypeOf(otherType) {
    if (otherType.is(this)) {
      return true;
    }
    if (!otherType.instanceOf(FunctionType)) {
      if (otherType.instanceOf(SimpleType)) {
        return false;
      } else {
        // We don't understand this relationship, so invert it.
        return otherType.isOfType(this);
      }
    }
    if (!this.getReturn().isSupertypeOf(otherType.getReturn())) {
      return false;
    }
    // The type relationship is upon the external argument interface.
    for (let index = 0; index < this.argumentTypes.length; index++) {
      if (
        !this.getArgument(index).isSupertypeOf(otherType.getArgument(index))
      ) {
        return false;
      }
    }
    return true;
  }

  toString() {
    return `function(${this.argumentTypes.join(',')}):${this.getReturn()}`;
  }
}

FunctionType.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  const returnType = type.result
    ? Type.fromDoctrineType(type.result, rec, typeContext)
    : Type.any;
  const argumentTypes = [];
  const parameterTypes = {};
  for (const param of type.params) {
    switch (param.type) {
      case 'ParameterType': {
        const argumentType = Type.fromDoctrineType(
          param.expression,
          {},
          typeContext
        );
        argumentTypes.push(argumentType);
        parameterTypes[param.name] = argumentType;
        break;
      }
      default: {
        const argumentType = Type.fromDoctrineType(param, {}, typeContext);
        argumentTypes.push(argumentType);
        break;
      }
    }
  }
  return new FunctionType(returnType, argumentTypes, parameterTypes);
};

FunctionType.fromDoctrine = (rec, typeContext) => {
  let returnType = Type.any;
  const argumentTypes = [];
  const parameterTypes = {};
  // FIX: Handle undeclared arguments?
  for (const tag of rec.tags) {
    switch (tag.title) {
      case 'return':
      case 'returns':
        returnType = Type.fromDoctrineType(tag.type, rec, typeContext);
        break;
      case 'param':
        const argumentType = tag.type
          ? Type.fromDoctrineType(tag.type, rec, typeContext)
          : Type.any;
        argumentTypes.push(argumentType);
        if (tag.name) {
          parameterTypes[tag.name] = argumentType;
        }
    }
  }
  const type = new FunctionType(returnType, argumentTypes, parameterTypes);
  return type;
};

Type.any = new AnyType();
Type.undefined = new PrimitiveType('undefined');
Type.invalid = new Type();
Type.string = new PrimitiveType('string');
Type.number = new PrimitiveType('number');
Type.boolean = new PrimitiveType('boolean');
Type.object = new RecordType({});
Type.null = new PrimitiveType('null');
Type.wild = new WildType();
Type.RegExp = new PrimitiveType('RegExp');

Type.fromDoctrine = (rec, typeContext) => {
  let scope = typeContext.getScope();
  let type;
  for (const tag of rec.tags) {
    switch (tag.title) {
      case 'module': {
        scope = { module: tag.name };
        typeContext.setScope(scope);
        break;
      }
      case 'global': {
        typeContext.setScope({ kind: 'global' });
        break;
      }
      case 'typedef': {
        const typedef = new AliasType(tag.name);
        typeContext.setTypedef(tag.name, typedef);
        type = Type.fromDoctrineType(tag.type, rec, typeContext);
        typedef.rebindAliasType(type);
        break;
      }
      case 'type':
        type = Type.fromDoctrineType(tag.type, rec, typeContext);
        break;
      case 'return':
      case 'returns':
      case 'param':
        type = FunctionType.fromDoctrine(rec, typeContext);
        break;
    }
    if (type) {
      break;
    }
  }
  typeContext.setScope(scope);
  return type || Type.any;
};

Type.fromDoctrineType = (type, rec, typeContext) => {
  if (!type) {
    return Type.any;
  }
  switch (type.type) {
    case 'FunctionType':
      return FunctionType.fromDoctrineType(type, rec, typeContext);
    case 'RecordType':
      return RecordType.fromDoctrineType(type, rec, typeContext);
    case 'UnionType':
      return UnionType.fromDoctrineType(type, rec, typeContext);
    case 'NameExpression':
      if (type.name === 'object') {
        return RecordType.fromDoctrineType(type, rec, typeContext);
      } else {
        return PrimitiveType.fromDoctrineType(type, rec, typeContext);
      }
    case 'UndefinedLiteral':
      return PrimitiveType.fromDoctrineType(type, rec, typeContext);
    case 'TypeApplication':
      if (type.expression) {
        if (type.expression.type === 'NameExpression') {
          switch (type.expression.name) {
            case 'Array':
              return ArrayType.fromDoctrineType(type, rec, typeContext);
            case 'Promise':
              // e.g.
              // {"type":"TypeApplication","expression":{"type":"NameExpression","name":"Promise"},"applications":[{"type":"NameExpression","name":"ClipperLibWrapper"}]}
              // FIX: Handle this properly.
              console.log(`Unexpected TypeApplication ${JSON.stringify(type)}`);
              return Type.any;
            case 'LinkedList':
              // {"type":"TypeApplication","expression":{"type":"NameExpression","name":"LinkedList"},"applications":[{"type":"UnionType","elements":[{"type":"NameExpression","name":"string"},{"type":"NameExpression","name":"Token"}]}]}
              console.log(`Unexpected TypeApplication ${JSON.stringify(type)}`);
              return Type.any;
            case 'LinkedListNode':
              // {type":"TypeApplication","expression":{"type":"NameExpression","name":"LinkedListNode"},"applications":[{"type":"UnionType","elements":[{"type":"NameExpression","name":"string"},{"type":"NameExpression","name":"Token"}]}]}
              console.log(`Unexpected TypeApplication ${JSON.stringify(type)}`);
              return Type.any;
          }
        }
      }

      throw Error(`Unexpected TypeApplication ${JSON.stringify(type)}`);
    case 'OptionalType':
      // This may require some refinement for arguments vs parameters.
      return new UnionType(
        Type.fromDoctrineType(type.expression, rec, typeContext),
        Type.undefined
      );
    case 'AllLiteral':
      return Type.any;
    case 'NullableLiteral':
      // We hijack this type -- let's see if there are problems.
      return Type.wild;
    case 'NullLiteral':
      console.log(`Unimplemented type ${type.type}`);
      return Type.any;
    default:
      throw Error(`Unexpected type ${JSON.stringify(type)}`);
  }
};

Type.parseComment = (line, comment, typeContext) => {
  const parse = typeContext.parseComment(comment, { unwrap: true });
  const type = Type.fromDoctrine(parse, typeContext);
  typeContext.setTypeDeclaration(line, type);
  return type;
};

Type.fromString = (string, typeContext) =>
  Type.fromDoctrineType(typeContext.parseType(string), {}, typeContext);

Type.fromNode = (node, typeContext) => {
  const startLine = (node) => node.loc.start.line;

  const resolveTypeFromNode = (node, typeContext) =>
    typeContext.getTypeDeclaration(startLine(node));

  const resolveTypeForBinaryExpression = (node, typeContext) => {
    const { left, operator, right } = node;
    switch (operator) {
      // Equality
      case '==':
      case '!=':
      case '===':
      case '!==':
        return Type.boolean;
      // Inequality
      case '<':
      case '<=':
      case '>':
      case '>=':
        return Type.boolean;
      // Shift
      case '<<':
      case '>>':
      case '>>>':
        return Type.number;
      // Arithmetic
      case '+':
        return left === 'string' || right === 'string'
          ? Type.string
          : Type.number;
      case '-':
      case '*':
      case '/':
      case '%':
        return Type.number;
      // Bitwise
      case '|':
      case '^':
      case '&':
        return Type.number;
      // Membership
      case 'in':
        return Type.boolean;
      case 'instanceof':
        return Type.any;
      // EX4, for some reason ...
      case '..':
        return Type.any;
      default:
        throw Error(`Unexpected binary operator: ${operator}`);
    }
  };

  const resolveTypeForUpdateExpression = (node, typeContext) => {
    // ++ and -- always yield number, I hope.
    return Type.number;
  };

  const resolveTypeForLogicalExpression = (node, typeContext) => {
    const { left, /* operator, */ right } = node;
    // These are the short-cut operators.
    const leftType = resolveType(left, typeContext);
    const rightType = resolveType(right, typeContext);
    // FIX: We can do better if we can prove the leftType cannot be inhabited by a non-false value.
    const type = new UnionType(leftType, rightType);
    return type;
  };

  const resolveTypeForAssignmentExpression = (node, typeContext) => {
    // const { left, operator, right } = node;
    const { right } = node;
    return resolveType(right, typeContext);
  };

  const resolveTypeForConditionalExpression = (node, typeContext) => {
    const { alternate, consequent } = node;
    const leftType = resolveType(consequent, typeContext);
    const rightType = resolveType(alternate, typeContext);
    const type = new UnionType(leftType, rightType);
    return type;
  };

  const resolveTypeForMemberExpression = (node, typeContext) => {
    const memberType = resolveType(node.object, typeContext);
    if (node.computed) {
      // FIX: Handle foo[bar].
      const propertyType = memberType.getElement();
      return propertyType;
    } else {
      const propertyType = memberType.getProperty(node.property.name);
      return propertyType;
    }
  };

  const resolveTypeForArrowFunctionExpression = (node, typeContext) =>
    resolveTypeFromNode(node, typeContext);

  const resolveTypeForFunctionExpression = (node, typeContext) =>
    resolveTypeFromNode(node, typeContext);

  const resolveTypeForCallExpression = (node, typeContext) => {
    return resolveType(node.callee, typeContext).getReturn();
  };

  const resolveTypeForArrayExpression = (node, typeContext) =>
    resolveTypeFromNode(node, typeContext);

  const resolveTypeForArrayPattern = (node, typeContext) =>
    resolveTypeFromNode(node, typeContext);

  const resolveTypeForObjectExpression = (node, typeContext) => {
    const record = {};
    for (const property of node.properties) {
      // FIX: Handle other combinations
      if (!property.key) {
        console.log(`Unimplemented property: ${generate(node)}`);
        return Type.any;
      }
      if (property.key.type === 'Literal' && property.kind === 'init') {
        record[property.key.value] = resolveType(property.value, typeContext);
      } else if (
        property.key.type === 'Identifier' &&
        property.kind === 'init'
      ) {
        record[property.key.name] = resolveType(property.value, typeContext);
      }
    }
    return new RecordType(record);
  };

  const resolveTypeForLiteral = (node, typeContext) => {
    // These can be: string | boolean | null | number | RegExp;
    const value = node.value;
    if (value === null) {
      return Type.null;
    } else if (typeof value === 'string') {
      return Type.string;
    } else if (typeof value === 'boolean') {
      return Type.boolean;
    } else if (typeof value === 'number') {
      return Type.number;
    } else if (typeof value === 'object' && value.constructor === RegExp) {
      return Type.RegExp;
    } else {
      return Type.invalid;
    }
  };
  const resolveTypeForUnaryExpression = (node, typeContext) => {
    switch (node.operator) {
      case '-':
        return Type.number;
      case '+':
        return Type.number;
      case '!':
        return Type.boolean;
      case '~':
        return Type.number;
      case 'typeof':
        return Type.string;
      case 'void':
        return Type.undefined;
      case 'delete':
        return Type.boolean;
      default:
        throw Error(`Unexpected unary operator: ${node.operator}`);
    }
  };

  const resolveTypeForVariableDeclarator = (node, typeContext) => {
    const type = resolveTypeFromNode(node, typeContext);
    if (type !== Type.any) {
      return type;
    }
    if (!node.init) {
      switch (node.parent.parent.type) {
        case 'ForOfStatement': {
          // This should be the left branch of the ForOf.
          // We can infer it from the element type of the right branch.
          if (node.parent.kind === 'const') {
            const rightType = resolveType(
              node.parent.parent.right,
              typeContext
            );
            const element = rightType.getElement();
            return element;
          }
          return Type.any;
        }
        case 'BlockStatement': {
          return Type.any;
        }
        default: {
          console.log(`QQ/node.parent.parent.type: ${node.parent.parent.type}`);
        }
      }
      return type;
    }
    if (node.parent.kind !== 'const') {
      return type;
    }
    // Infer const variable type from initializer.
    return resolveType(node.init, typeContext);
  };

  const resolveTypeForIdentifier = (node, typeContext) => {
    const binding = typeContext.acquireBinding(node);

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
      case 'ArrayPattern': {
        const parentType = Type.fromNode(parent, typeContext);
        const parameterType = parentType.getParameter(name);
        return parameterType;
      }
      case 'ArrowFunctionExpression': {
        // This should only happen for parameters.
        const parentType = Type.fromNode(parent, typeContext);
        const parameterType = parentType.getParameter(name);
        return parameterType;
      }
      case 'FunctionDeclaration': {
        const parentType = Type.fromNode(parent, typeContext);
        // CHECK: How do we handle the case where the function has a parmeter with the same name as the function?
        // The correct binding would depend on if we were originally inside or not, so we can trace the parent down.
        if (parentType.hasParameter(name)) {
          return parentType.getParameter(name);
        } else {
          return parentType;
        }
      }
      case 'FunctionExpression': {
        // This should only happen for parameters.
        return Type.fromNode(parent, typeContext).getParameter(name);
      }
      case 'ImportDefaultSpecifier': {
        const externalTypeContext = typeContext.importModule(
          parent.parent.source.value
        );
        const declaration = externalTypeContext.getDefaultExportDeclaration();
        if (!declaration) {
          return Type.any;
        }
        const type = Type.fromNode(declaration, externalTypeContext);
        return type;
      }
      case 'ImportSpecifier': {
        const path = parent.parent.source.value;
        const externalSymbol = parent.imported.name;
        return typeContext.getNamedExportType(path, externalSymbol);
      }
      case 'VariableDeclarator': {
        // FIX: This should be at the Declaration level so that we can see if it is const.
        // We can infer the type of const variables from their initialization, but others might be mutated.
        // So we require an explicit declaration, which is detected above.
        return Type.fromNode(parent, typeContext);
      }
      case 'RestElement':
      case 'ClassDeclaration':
      case 'CatchClause':
      case 'ImportNamespaceSpecifier':
      case 'Property': {
        console.log(`Unimplemented parent.type: ${parent.type}.`);
        return Type.any;
      }
      default:
        throw Error(`Unexpected parent.type: ${parent.type}`);
    }
  };

  const resolveType = (node, typeContext) => {
    switch (node.type) {
      case 'ArrayPattern':
        return resolveTypeForArrayPattern(node, typeContext);
      case 'ArrayExpression':
        return resolveTypeForArrayExpression(node, typeContext);
      case 'ArrowFunctionExpression':
        return resolveTypeForArrowFunctionExpression(node, typeContext);
      case 'AssignmentExpression':
        return resolveTypeForAssignmentExpression(node, typeContext);
      case 'AwaitExpression': {
        console.log(`AwaitExpression is unimplemented.`);
        return Type.any;
      }
      case 'BinaryExpression':
        return resolveTypeForBinaryExpression(node);
      case 'CallExpression':
        return resolveTypeForCallExpression(node, typeContext);
      case 'ConditionalExpression':
        return resolveTypeForConditionalExpression(node, typeContext);
      case 'FunctionDeclaration':
        return resolveTypeForFunctionExpression(node, typeContext);
      case 'FunctionExpression':
        return resolveTypeForFunctionExpression(node, typeContext);
      case 'Identifier':
        return resolveTypeForIdentifier(node, typeContext);
      case 'JSXElement':
        return Type.fromString('JSXElement', typeContext);
      case 'Literal':
        return resolveTypeForLiteral(node);
      case 'LogicalExpression':
        return resolveTypeForLogicalExpression(node, typeContext);
      case 'MemberExpression':
        return resolveTypeForMemberExpression(node, typeContext);
      case 'ObjectExpression':
        return resolveTypeForObjectExpression(node, typeContext);
      case 'SpreadElement':
        // This needs to be understood in the context of a CallExpression.
        return Type.any;
      case 'TemplateLiteral':
        return Type.string;
      case 'UpdateExpression':
        return resolveTypeForUpdateExpression();
      case 'UnaryExpression':
        return resolveTypeForUnaryExpression(node);
      case 'VariableDeclarator':
        return resolveTypeForVariableDeclarator(node, typeContext);
      case 'ObjectPattern':
      case 'OptionalCallExpression':
      case 'NewExpression':
      case 'Super':
      case 'ThisExpression':
        console.log(`Unimplemented node.type: ${node.type}.`);
        return Type.any;
      default:
        throw Error(
          `Unexpected node type: ${node.type}: ${generate(node)}`
        );
    }
  };

  const type = resolveType(node, typeContext);
  return type;
};

exports.FunctionType = FunctionType;
exports.PrimitiveType = PrimitiveType;
exports.RecordType = RecordType;
exports.Type = Type;
exports.TypeContext = TypeContext;
exports.UnionType = UnionType;
