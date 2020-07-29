import { generate as toStringFromNode } from './astring';

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
        console.log(`Unimplemented property: ${toStringFromNode(node)}`);
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
        return resolveTypeForBinaryExpression(node, typeContext);
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
        return resolveTypeForLiteral(node, typeContext);
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
        return resolveTypeForUpdateExpression(node, typeContext);
      case 'UnaryExpression':
        return resolveTypeForUnaryExpression(node, typeContext);
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
          `Unexpected node type: ${node.type}: ${toStringFromNode(node)}`
        );
    }
  };

  const type = resolveType(node, typeContext);
  return type;
};

export {
  Type,
  TypeContext,
  PrimitiveType,
  UnionType,
  RecordType,
  FunctionType,
};
