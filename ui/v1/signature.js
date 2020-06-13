// FIX: Consider using a proper grammar.
export const toSignature = (string) => {
  // "Shape -> Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape"

  const [, prefix, body, suffix] =
    string.match(/([^(]*)[(]([^)]*)[)](.*)/) || [];
  const [, inputType, inputOp] = prefix.match(/([^ ]*) -> ([^ ]*)/) || [];
  const operation = inputOp || prefix;
  const [, restArgs, options, rest] =
    body.match(/([^{]*)[{]([^}]*)[}][, ]*(.*)/) || [];
  const args = restArgs === undefined ? body : restArgs;
  const [, , outputType] = suffix.match(/([^ ]*) -> ([^ ]*)/) || [];

  let restSpec;

  const argSpecs = [];
  for (const arg of args.split(',')) {
    const [, initializedDeclaration, value] =
      arg.match(/ *([^=]*) *= *([^ ]*)/) || [];
    const declaration = initializedDeclaration || arg;
    const [, typedDeclaration, type] =
      declaration.match(/ *([^:]*):([^ ]*)/) || [];
    const name = typedDeclaration || declaration;
    if (name.match(/^ *$/) === null) {
      const argSpec = {};
      if (type) argSpec.type = type;
      if (value) argSpec.value = value;
      if (name) {
        if (name.startsWith('...')) {
          argSpec.name = name.substring(3);
          restSpec = argSpec;
        } else {
          argSpec.name = name;
          argSpecs.push(argSpec);
        }
      }
    }
  }

  const optionSpecs = [];
  if (options !== undefined) {
    for (const option of options.split(',')) {
      const [, initializedDeclaration, value] =
        option.match(/ *([^=]*) *= *([^ ]*)/) || [];
      const declaration = initializedDeclaration || option;
      const [, typedDeclaration, type] =
        declaration.match(/ *([^:]*):([^ ]*)/) || [];
      const name = typedDeclaration || declaration;
      if (name.match(/^ *$/) === null) {
        const optionSpec = {};
        if (name) optionSpec.name = name;
        if (type) optionSpec.type = type;
        if (value) optionSpec.value = value;
        optionSpecs.push(optionSpec);
      }
    }
  }

  if (rest) {
    const [, name, type] = rest.match(/ *([^:]*):([^ ]*)/) || [];
    if (name.match(/^ *$/) === null && name.startsWith('...')) {
      restSpec = {
        name: name.substring(3),
        type,
      };
    }
  }

  // Decode the operation
  let operationSpec;
  {
    const [, namespace, name] = operation.match(/([^.]*)(.*)/) || [];
    if (namespace && name) {
      operationSpec = { namespace, name: name.substring(1) };
    } else if (!namespace && name.startsWith('.')) {
      operationSpec = { name: name.substring(1), isMethod: true };
    } else if (namespace) {
      operationSpec = { name: namespace };
    }
  }

  const spec = {};
  if (inputType) spec.inputType = inputType;
  if (operationSpec) spec.operation = operationSpec;
  if (argSpecs && argSpecs.length > 0) spec.args = argSpecs;
  if (optionSpecs && optionSpecs.length > 0) spec.options = optionSpecs;
  if (restSpec) spec.rest = restSpec;
  if (outputType) spec.outputType = outputType;
  spec.string = string;
  return spec;
};

const startsWithUpperCase = (string) => {
  const first = string[0];
  if (first === undefined) {
    // ""
    return false;
  }
  if (first === first.toLowerCase()) {
    // 'i', '5'
    return false;
  }
  if (first !== first.toUpperCase()) {
    return false;
  }
  return true;
};

export const toSnippet = ({
  inputType,
  operation,
  args,
  options,
  rest,
  outputType,
  string,
}) => {
  const { name, namespace } = operation;
  const snippet = {};
  if (inputType) {
    snippet.meta = `${inputType} method`;
    snippet.isMethod = true;
    snippet.name = `.${name}`;
    snippet.trigger = `${name}`;
    snippet.content = `${name}(${'$'}${1})`;
  } else if (namespace) {
    snippet.meta = `${namespace} constructor`;
    snippet.name = `${namespace}.${name}`;
    snippet.trigger = `${namespace}.${name}`;
    snippet.content = `${namespace}.${name}(${'$'}{1})`;
  } else if (startsWithUpperCase(name)) {
    snippet.meta = `constructor`;
    snippet.name = name;
    snippet.trigger = name;
    snippet.content = `${name}(${'$'}{1})`;
  } else {
    snippet.meta = `function`;
    snippet.name = name;
    snippet.trigger = name;
    snippet.content = `${name}(${'$'}{1})`;
  }
  snippet.type = 'snippet';
  snippet.docHTML = string;
  return snippet;
};
