/**
 * Trivial dependency injection.
 *
 * Provides a lazy function map from context and name to value.
 * Context provides a way to make caller dependent dependencies.
 * If no value is found and no constructor provided then it will fall back
 * to a look-up upon the undefined context.
 *
 * @param {String} name - the name to look up.
 * @param {String=''} context - the context of the caller, defaulting to the fallback context ''.
 * @param {Function=} constructor - called to provide the value if needed, defaults to undefined.
 * @returns {Any} value - the actual value.
 *
 * @example
 * const math = require('@jsxcad')('@jscad/math')
 * math is undefined if not provided elsewhere already.
 *
 * @example
 * const math = require('@jsxcad')('@jscad/math', () => require('@jscad/math'))
 * math is the result if require('@jscad/max') if not provided elsewhere already.
 *
 * @example
 * const math = require('@jsxcad')('@jscad/math', undefined, '@jscad/algorithm/hull')
 * This will try to find '@jscad/math' in the '@jscad/algorithm/hull' context, then fall back to
 * require('@jscad')('@jscad/math').
 */

const contexts = {};

const provide = (name, context = '', ctor) => {
  if (typeof name === 'object') {
    if (name.__jsxcadTag__ === undefined) {
      throw Error('Tried to provide for object without __jsxcadTag__');
    }
    name = name.__jsxcadTag__;
  }
  if (contexts[context] === undefined) {
    contexts[context] = {};
  }
  if (contexts[context][name] === undefined) {
    if (ctor === undefined) {
      // Look it up in the global context, defaulting to an undefined value.
      contexts[context][name] = provide(name, '', () => undefined);
    } else {
      contexts[context][name] = ctor();
    }
  }
  return contexts[context][name];
};

const systemRequire = require;

const publish = ({ base, require }, ...names) => {
  // FIX: Remove this once backward compatibility is not needed.
  if (require === undefined) {
    require = (name) => systemRequire(`${base}/${name}`);
  } else {
    const moduleRequire = require;
    require = (name) => moduleRequire(`./${name}`);
  }
  const exports = {};

  // Provide each export of the module.
  names.forEach(name => {
    exports[name] = provide(`${base}/${name}`, '', () => require(name));
    return exports[name];
  });

  // Provide the module as a whole.
  provide(base, '', () => exports);

  return exports;
};

module.exports = {
  provide,
  publish
};
