/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = async name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    if (!registry[name]) {
      
        await new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            
              script.src = name;
            
            // Ya never know
            script.defer = true;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      

      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
    }
    return registry[name];
  };

  const require = async (names, resolve) => {
    const modules = await Promise.all(names.map(singleRequire));
    resolve(modules.length === 1 ? modules[0] : modules);
  };

  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = new Promise(async resolve => {
      let exports = {};
      const module = {
        
          uri: location.origin + moduleName.slice(1)
        
      };
      const deps = await Promise.all(
        depsNames.map(depName => {
          if (depName === "exports") {
            return exports;
          }
          if (depName === "module") {
            return module;
          }
          return singleRequire(depName);
        })
      );
      const facValue = factory(...deps);
      if(!exports.default) {
        exports.default = facValue;
      }
      resolve(exports);
    });
  };
}
define("./auth.js",[],function () { 'use strict';

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser = true;
  var env = {};
  var argv = [];
  var version = ''; // empty string to avoid regexp issues
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {};
  var performanceNow =
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  // Inlined browser-or-node@1.2.1 due to es6 importing issue.
  const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
  };
  /* global window self */


  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  /* eslint-disable no-restricted-globals */

  const isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
  /* eslint-enable no-restricted-globals */

  const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  // When base is undefined the persistent filesystem is disabled.
  let base;
  const getBase = () => base;
  const setupFilesystem = ({
    fileBase
  }) => {
    // A prefix used to partition the persistent filesystem for multiple projects.
    if (fileBase !== undefined) {
      if (fileBase.endsWith('/')) {
        base = fileBase;
      } else {
        base = `${fileBase}/`;
      }
    }
  };
  const getFilesystem = () => {
    if (base !== undefined) {
      const [filesystem] = base.split('/');
      return filesystem;
    }
  };

  const promises = {};

  var fs = /*#__PURE__*/Object.freeze({
    __proto__: null,
    promises: promises
  });

  const files = new Map();
  const fileCreationWatchers = new Set();
  const getFile = async (options, unqualifiedPath) => {
    const path = `${getBase()}${unqualifiedPath}`;
    let file = files.get(path);

    if (file === undefined) {
      file = {
        path: unqualifiedPath,
        watchers: new Set(),
        storageKey: `jsxcad/${path}`
      };
      files.set(path, file);

      for (const watcher of fileCreationWatchers) {
        await watcher(options, file);
      }
    }

    return file;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var localforage = createCommonjsModule(function (module, exports) {
  /*!
      localForage -- Offline Storage, Improved
      Version 1.7.3
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */
  (function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
  (function (global){
  var Mutation = global.MutationObserver || global.WebKitMutationObserver;

  var scheduleDrain;

  {
    if (Mutation) {
      var called = 0;
      var observer = new Mutation(nextTick);
      var element = global.document.createTextNode('');
      observer.observe(element, {
        characterData: true
      });
      scheduleDrain = function () {
        element.data = (called = ++called % 2);
      };
    } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
      var channel = new global.MessageChannel();
      channel.port1.onmessage = nextTick;
      scheduleDrain = function () {
        channel.port2.postMessage(0);
      };
    } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
      scheduleDrain = function () {

        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var scriptEl = global.document.createElement('script');
        scriptEl.onreadystatechange = function () {
          nextTick();

          scriptEl.onreadystatechange = null;
          scriptEl.parentNode.removeChild(scriptEl);
          scriptEl = null;
        };
        global.document.documentElement.appendChild(scriptEl);
      };
    } else {
      scheduleDrain = function () {
        setTimeout(nextTick, 0);
      };
    }
  }

  var draining;
  var queue = [];
  //named nextTick for less confusing stack traces
  function nextTick() {
    draining = true;
    var i, oldQueue;
    var len = queue.length;
    while (len) {
      oldQueue = queue;
      queue = [];
      i = -1;
      while (++i < len) {
        oldQueue[i]();
      }
      len = queue.length;
    }
    draining = false;
  }

  module.exports = immediate;
  function immediate(task) {
    if (queue.push(task) === 1 && !draining) {
      scheduleDrain();
    }
  }

  }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  },{}],2:[function(_dereq_,module,exports){
  var immediate = _dereq_(1);

  /* istanbul ignore next */
  function INTERNAL() {}

  var handlers = {};

  var REJECTED = ['REJECTED'];
  var FULFILLED = ['FULFILLED'];
  var PENDING = ['PENDING'];

  module.exports = Promise;

  function Promise(resolver) {
    if (typeof resolver !== 'function') {
      throw new TypeError('resolver must be a function');
    }
    this.state = PENDING;
    this.queue = [];
    this.outcome = void 0;
    if (resolver !== INTERNAL) {
      safelyResolveThenable(this, resolver);
    }
  }

  Promise.prototype["catch"] = function (onRejected) {
    return this.then(null, onRejected);
  };
  Promise.prototype.then = function (onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
      typeof onRejected !== 'function' && this.state === REJECTED) {
      return this;
    }
    var promise = new this.constructor(INTERNAL);
    if (this.state !== PENDING) {
      var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
      unwrap(promise, resolver, this.outcome);
    } else {
      this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
    }

    return promise;
  };
  function QueueItem(promise, onFulfilled, onRejected) {
    this.promise = promise;
    if (typeof onFulfilled === 'function') {
      this.onFulfilled = onFulfilled;
      this.callFulfilled = this.otherCallFulfilled;
    }
    if (typeof onRejected === 'function') {
      this.onRejected = onRejected;
      this.callRejected = this.otherCallRejected;
    }
  }
  QueueItem.prototype.callFulfilled = function (value) {
    handlers.resolve(this.promise, value);
  };
  QueueItem.prototype.otherCallFulfilled = function (value) {
    unwrap(this.promise, this.onFulfilled, value);
  };
  QueueItem.prototype.callRejected = function (value) {
    handlers.reject(this.promise, value);
  };
  QueueItem.prototype.otherCallRejected = function (value) {
    unwrap(this.promise, this.onRejected, value);
  };

  function unwrap(promise, func, value) {
    immediate(function () {
      var returnValue;
      try {
        returnValue = func(value);
      } catch (e) {
        return handlers.reject(promise, e);
      }
      if (returnValue === promise) {
        handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
      } else {
        handlers.resolve(promise, returnValue);
      }
    });
  }

  handlers.resolve = function (self, value) {
    var result = tryCatch(getThen, value);
    if (result.status === 'error') {
      return handlers.reject(self, result.value);
    }
    var thenable = result.value;

    if (thenable) {
      safelyResolveThenable(self, thenable);
    } else {
      self.state = FULFILLED;
      self.outcome = value;
      var i = -1;
      var len = self.queue.length;
      while (++i < len) {
        self.queue[i].callFulfilled(value);
      }
    }
    return self;
  };
  handlers.reject = function (self, error) {
    self.state = REJECTED;
    self.outcome = error;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callRejected(error);
    }
    return self;
  };

  function getThen(obj) {
    // Make sure we only access the accessor once as required by the spec
    var then = obj && obj.then;
    if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
      return function appyThen() {
        then.apply(obj, arguments);
      };
    }
  }

  function safelyResolveThenable(self, thenable) {
    // Either fulfill, reject or reject with error
    var called = false;
    function onError(value) {
      if (called) {
        return;
      }
      called = true;
      handlers.reject(self, value);
    }

    function onSuccess(value) {
      if (called) {
        return;
      }
      called = true;
      handlers.resolve(self, value);
    }

    function tryToUnwrap() {
      thenable(onSuccess, onError);
    }

    var result = tryCatch(tryToUnwrap);
    if (result.status === 'error') {
      onError(result.value);
    }
  }

  function tryCatch(func, value) {
    var out = {};
    try {
      out.value = func(value);
      out.status = 'success';
    } catch (e) {
      out.status = 'error';
      out.value = e;
    }
    return out;
  }

  Promise.resolve = resolve;
  function resolve(value) {
    if (value instanceof this) {
      return value;
    }
    return handlers.resolve(new this(INTERNAL), value);
  }

  Promise.reject = reject;
  function reject(reason) {
    var promise = new this(INTERNAL);
    return handlers.reject(promise, reason);
  }

  Promise.all = all;
  function all(iterable) {
    var self = this;
    if (Object.prototype.toString.call(iterable) !== '[object Array]') {
      return this.reject(new TypeError('must be an array'));
    }

    var len = iterable.length;
    var called = false;
    if (!len) {
      return this.resolve([]);
    }

    var values = new Array(len);
    var resolved = 0;
    var i = -1;
    var promise = new this(INTERNAL);

    while (++i < len) {
      allResolver(iterable[i], i);
    }
    return promise;
    function allResolver(value, i) {
      self.resolve(value).then(resolveFromAll, function (error) {
        if (!called) {
          called = true;
          handlers.reject(promise, error);
        }
      });
      function resolveFromAll(outValue) {
        values[i] = outValue;
        if (++resolved === len && !called) {
          called = true;
          handlers.resolve(promise, values);
        }
      }
    }
  }

  Promise.race = race;
  function race(iterable) {
    var self = this;
    if (Object.prototype.toString.call(iterable) !== '[object Array]') {
      return this.reject(new TypeError('must be an array'));
    }

    var len = iterable.length;
    var called = false;
    if (!len) {
      return this.resolve([]);
    }

    var i = -1;
    var promise = new this(INTERNAL);

    while (++i < len) {
      resolver(iterable[i]);
    }
    return promise;
    function resolver(value) {
      self.resolve(value).then(function (response) {
        if (!called) {
          called = true;
          handlers.resolve(promise, response);
        }
      }, function (error) {
        if (!called) {
          called = true;
          handlers.reject(promise, error);
        }
      });
    }
  }

  },{"1":1}],3:[function(_dereq_,module,exports){
  (function (global){
  if (typeof global.Promise !== 'function') {
    global.Promise = _dereq_(2);
  }

  }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  },{"2":2}],4:[function(_dereq_,module,exports){

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function getIDB() {
      /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
      try {
          if (typeof indexedDB !== 'undefined') {
              return indexedDB;
          }
          if (typeof webkitIndexedDB !== 'undefined') {
              return webkitIndexedDB;
          }
          if (typeof mozIndexedDB !== 'undefined') {
              return mozIndexedDB;
          }
          if (typeof OIndexedDB !== 'undefined') {
              return OIndexedDB;
          }
          if (typeof msIndexedDB !== 'undefined') {
              return msIndexedDB;
          }
      } catch (e) {
          return;
      }
  }

  var idb = getIDB();

  function isIndexedDBValid() {
      try {
          // Initialize IndexedDB; fall back to vendor-prefixed versions
          // if needed.
          if (!idb) {
              return false;
          }
          // We mimic PouchDB here;
          //
          // We test for openDatabase because IE Mobile identifies itself
          // as Safari. Oh the lulz...
          var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

          var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

          // Safari <10.1 does not meet our requirements for IDB support (#5572)
          // since Safari 10.1 shipped with fetch, we can use that to detect it
          return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
          // some outdated implementations of IDB that appear on Samsung
          // and HTC Android devices <4.4 are missing IDBKeyRange
          // See: https://github.com/mozilla/localForage/issues/128
          // See: https://github.com/mozilla/localForage/issues/272
          typeof IDBKeyRange !== 'undefined';
      } catch (e) {
          return false;
      }
  }

  // Abstracts constructing a Blob object, so it also works in older
  // browsers that don't support the native Blob constructor. (i.e.
  // old QtWebKit versions, at least).
  // Abstracts constructing a Blob object, so it also works in older
  // browsers that don't support the native Blob constructor. (i.e.
  // old QtWebKit versions, at least).
  function createBlob(parts, properties) {
      /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
      parts = parts || [];
      properties = properties || {};
      try {
          return new Blob(parts, properties);
      } catch (e) {
          if (e.name !== 'TypeError') {
              throw e;
          }
          var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
          var builder = new Builder();
          for (var i = 0; i < parts.length; i += 1) {
              builder.append(parts[i]);
          }
          return builder.getBlob(properties.type);
      }
  }

  // This is CommonJS because lie is an external dependency, so Rollup
  // can just ignore it.
  if (typeof Promise === 'undefined') {
      // In the "nopromises" build this will just throw if you don't have
      // a global promise object, but it would throw anyway later.
      _dereq_(3);
  }
  var Promise$1 = Promise;

  function executeCallback(promise, callback) {
      if (callback) {
          promise.then(function (result) {
              callback(null, result);
          }, function (error) {
              callback(error);
          });
      }
  }

  function executeTwoCallbacks(promise, callback, errorCallback) {
      if (typeof callback === 'function') {
          promise.then(callback);
      }

      if (typeof errorCallback === 'function') {
          promise["catch"](errorCallback);
      }
  }

  function normalizeKey(key) {
      // Cast the key to a string, as that's all we can set as a key.
      if (typeof key !== 'string') {
          console.warn(key + ' used as a key, but it is not a string.');
          key = String(key);
      }

      return key;
  }

  function getCallback() {
      if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
          return arguments[arguments.length - 1];
      }
  }

  // Some code originally from async_storage.js in
  // [Gaia](https://github.com/mozilla-b2g/gaia).

  var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
  var supportsBlobs = void 0;
  var dbContexts = {};
  var toString = Object.prototype.toString;

  // Transaction Modes
  var READ_ONLY = 'readonly';
  var READ_WRITE = 'readwrite';

  // Transform a binary string to an array buffer, because otherwise
  // weird stuff happens when you try to work with the binary string directly.
  // It is known.
  // From http://stackoverflow.com/questions/14967647/ (continues on next line)
  // encode-decode-image-with-base64-breaks-image (2013-04-21)
  function _binStringToArrayBuffer(bin) {
      var length = bin.length;
      var buf = new ArrayBuffer(length);
      var arr = new Uint8Array(buf);
      for (var i = 0; i < length; i++) {
          arr[i] = bin.charCodeAt(i);
      }
      return buf;
  }

  //
  // Blobs are not supported in all versions of IndexedDB, notably
  // Chrome <37 and Android <5. In those versions, storing a blob will throw.
  //
  // Various other blob bugs exist in Chrome v37-42 (inclusive).
  // Detecting them is expensive and confusing to users, and Chrome 37-42
  // is at very low usage worldwide, so we do a hacky userAgent check instead.
  //
  // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
  // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
  // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
  //
  // Code borrowed from PouchDB. See:
  // https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
  //
  function _checkBlobSupportWithoutCaching(idb) {
      return new Promise$1(function (resolve) {
          var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
          var blob = createBlob(['']);
          txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

          txn.onabort = function (e) {
              // If the transaction aborts now its due to not being able to
              // write to the database, likely due to the disk being full
              e.preventDefault();
              e.stopPropagation();
              resolve(false);
          };

          txn.oncomplete = function () {
              var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
              var matchedEdge = navigator.userAgent.match(/Edge\//);
              // MS Edge pretends to be Chrome 42:
              // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
              resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
          };
      })["catch"](function () {
          return false; // error, so assume unsupported
      });
  }

  function _checkBlobSupport(idb) {
      if (typeof supportsBlobs === 'boolean') {
          return Promise$1.resolve(supportsBlobs);
      }
      return _checkBlobSupportWithoutCaching(idb).then(function (value) {
          supportsBlobs = value;
          return supportsBlobs;
      });
  }

  function _deferReadiness(dbInfo) {
      var dbContext = dbContexts[dbInfo.name];

      // Create a deferred object representing the current database operation.
      var deferredOperation = {};

      deferredOperation.promise = new Promise$1(function (resolve, reject) {
          deferredOperation.resolve = resolve;
          deferredOperation.reject = reject;
      });

      // Enqueue the deferred operation.
      dbContext.deferredOperations.push(deferredOperation);

      // Chain its promise to the database readiness.
      if (!dbContext.dbReady) {
          dbContext.dbReady = deferredOperation.promise;
      } else {
          dbContext.dbReady = dbContext.dbReady.then(function () {
              return deferredOperation.promise;
          });
      }
  }

  function _advanceReadiness(dbInfo) {
      var dbContext = dbContexts[dbInfo.name];

      // Dequeue a deferred operation.
      var deferredOperation = dbContext.deferredOperations.pop();

      // Resolve its promise (which is part of the database readiness
      // chain of promises).
      if (deferredOperation) {
          deferredOperation.resolve();
          return deferredOperation.promise;
      }
  }

  function _rejectReadiness(dbInfo, err) {
      var dbContext = dbContexts[dbInfo.name];

      // Dequeue a deferred operation.
      var deferredOperation = dbContext.deferredOperations.pop();

      // Reject its promise (which is part of the database readiness
      // chain of promises).
      if (deferredOperation) {
          deferredOperation.reject(err);
          return deferredOperation.promise;
      }
  }

  function _getConnection(dbInfo, upgradeNeeded) {
      return new Promise$1(function (resolve, reject) {
          dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

          if (dbInfo.db) {
              if (upgradeNeeded) {
                  _deferReadiness(dbInfo);
                  dbInfo.db.close();
              } else {
                  return resolve(dbInfo.db);
              }
          }

          var dbArgs = [dbInfo.name];

          if (upgradeNeeded) {
              dbArgs.push(dbInfo.version);
          }

          var openreq = idb.open.apply(idb, dbArgs);

          if (upgradeNeeded) {
              openreq.onupgradeneeded = function (e) {
                  var db = openreq.result;
                  try {
                      db.createObjectStore(dbInfo.storeName);
                      if (e.oldVersion <= 1) {
                          // Added when support for blob shims was added
                          db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                      }
                  } catch (ex) {
                      if (ex.name === 'ConstraintError') {
                          console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                      } else {
                          throw ex;
                      }
                  }
              };
          }

          openreq.onerror = function (e) {
              e.preventDefault();
              reject(openreq.error);
          };

          openreq.onsuccess = function () {
              resolve(openreq.result);
              _advanceReadiness(dbInfo);
          };
      });
  }

  function _getOriginalConnection(dbInfo) {
      return _getConnection(dbInfo, false);
  }

  function _getUpgradedConnection(dbInfo) {
      return _getConnection(dbInfo, true);
  }

  function _isUpgradeNeeded(dbInfo, defaultVersion) {
      if (!dbInfo.db) {
          return true;
      }

      var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
      var isDowngrade = dbInfo.version < dbInfo.db.version;
      var isUpgrade = dbInfo.version > dbInfo.db.version;

      if (isDowngrade) {
          // If the version is not the default one
          // then warn for impossible downgrade.
          if (dbInfo.version !== defaultVersion) {
              console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
          }
          // Align the versions to prevent errors.
          dbInfo.version = dbInfo.db.version;
      }

      if (isUpgrade || isNewStore) {
          // If the store is new then increment the version (if needed).
          // This will trigger an "upgradeneeded" event which is required
          // for creating a store.
          if (isNewStore) {
              var incVersion = dbInfo.db.version + 1;
              if (incVersion > dbInfo.version) {
                  dbInfo.version = incVersion;
              }
          }

          return true;
      }

      return false;
  }

  // encode a blob for indexeddb engines that don't support blobs
  function _encodeBlob(blob) {
      return new Promise$1(function (resolve, reject) {
          var reader = new FileReader();
          reader.onerror = reject;
          reader.onloadend = function (e) {
              var base64 = btoa(e.target.result || '');
              resolve({
                  __local_forage_encoded_blob: true,
                  data: base64,
                  type: blob.type
              });
          };
          reader.readAsBinaryString(blob);
      });
  }

  // decode an encoded blob
  function _decodeBlob(encodedBlob) {
      var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
      return createBlob([arrayBuff], { type: encodedBlob.type });
  }

  // is this one of our fancy encoded blobs?
  function _isEncodedBlob(value) {
      return value && value.__local_forage_encoded_blob;
  }

  // Specialize the default `ready()` function by making it dependent
  // on the current database operations. Thus, the driver will be actually
  // ready when it's been initialized (default) *and* there are no pending
  // operations on the database (initiated by some other instances).
  function _fullyReady(callback) {
      var self = this;

      var promise = self._initReady().then(function () {
          var dbContext = dbContexts[self._dbInfo.name];

          if (dbContext && dbContext.dbReady) {
              return dbContext.dbReady;
          }
      });

      executeTwoCallbacks(promise, callback, callback);
      return promise;
  }

  // Try to establish a new db connection to replace the
  // current one which is broken (i.e. experiencing
  // InvalidStateError while creating a transaction).
  function _tryReconnect(dbInfo) {
      _deferReadiness(dbInfo);

      var dbContext = dbContexts[dbInfo.name];
      var forages = dbContext.forages;

      for (var i = 0; i < forages.length; i++) {
          var forage = forages[i];
          if (forage._dbInfo.db) {
              forage._dbInfo.db.close();
              forage._dbInfo.db = null;
          }
      }
      dbInfo.db = null;

      return _getOriginalConnection(dbInfo).then(function (db) {
          dbInfo.db = db;
          if (_isUpgradeNeeded(dbInfo)) {
              // Reopen the database for upgrading.
              return _getUpgradedConnection(dbInfo);
          }
          return db;
      }).then(function (db) {
          // store the latest db reference
          // in case the db was upgraded
          dbInfo.db = dbContext.db = db;
          for (var i = 0; i < forages.length; i++) {
              forages[i]._dbInfo.db = db;
          }
      })["catch"](function (err) {
          _rejectReadiness(dbInfo, err);
          throw err;
      });
  }

  // FF doesn't like Promises (micro-tasks) and IDDB store operations,
  // so we have to do it with callbacks
  function createTransaction(dbInfo, mode, callback, retries) {
      if (retries === undefined) {
          retries = 1;
      }

      try {
          var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
          callback(null, tx);
      } catch (err) {
          if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
              return Promise$1.resolve().then(function () {
                  if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                      // increase the db version, to create the new ObjectStore
                      if (dbInfo.db) {
                          dbInfo.version = dbInfo.db.version + 1;
                      }
                      // Reopen the database for upgrading.
                      return _getUpgradedConnection(dbInfo);
                  }
              }).then(function () {
                  return _tryReconnect(dbInfo).then(function () {
                      createTransaction(dbInfo, mode, callback, retries - 1);
                  });
              })["catch"](callback);
          }

          callback(err);
      }
  }

  function createDbContext() {
      return {
          // Running localForages sharing a database.
          forages: [],
          // Shared database.
          db: null,
          // Database readiness (promise).
          dbReady: null,
          // Deferred operations on the database.
          deferredOperations: []
      };
  }

  // Open the IndexedDB database (automatically creates one if one didn't
  // previously exist), using any options set in the config.
  function _initStorage(options) {
      var self = this;
      var dbInfo = {
          db: null
      };

      if (options) {
          for (var i in options) {
              dbInfo[i] = options[i];
          }
      }

      // Get the current context of the database;
      var dbContext = dbContexts[dbInfo.name];

      // ...or create a new context.
      if (!dbContext) {
          dbContext = createDbContext();
          // Register the new context in the global container.
          dbContexts[dbInfo.name] = dbContext;
      }

      // Register itself as a running localForage in the current context.
      dbContext.forages.push(self);

      // Replace the default `ready()` function with the specialized one.
      if (!self._initReady) {
          self._initReady = self.ready;
          self.ready = _fullyReady;
      }

      // Create an array of initialization states of the related localForages.
      var initPromises = [];

      function ignoreErrors() {
          // Don't handle errors here,
          // just makes sure related localForages aren't pending.
          return Promise$1.resolve();
      }

      for (var j = 0; j < dbContext.forages.length; j++) {
          var forage = dbContext.forages[j];
          if (forage !== self) {
              // Don't wait for itself...
              initPromises.push(forage._initReady()["catch"](ignoreErrors));
          }
      }

      // Take a snapshot of the related localForages.
      var forages = dbContext.forages.slice(0);

      // Initialize the connection process only when
      // all the related localForages aren't pending.
      return Promise$1.all(initPromises).then(function () {
          dbInfo.db = dbContext.db;
          // Get the connection or open a new one without upgrade.
          return _getOriginalConnection(dbInfo);
      }).then(function (db) {
          dbInfo.db = db;
          if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
              // Reopen the database for upgrading.
              return _getUpgradedConnection(dbInfo);
          }
          return db;
      }).then(function (db) {
          dbInfo.db = dbContext.db = db;
          self._dbInfo = dbInfo;
          // Share the final connection amongst related localForages.
          for (var k = 0; k < forages.length; k++) {
              var forage = forages[k];
              if (forage !== self) {
                  // Self is already up-to-date.
                  forage._dbInfo.db = dbInfo.db;
                  forage._dbInfo.version = dbInfo.version;
              }
          }
      });
  }

  function getItem(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var req = store.get(key);

                      req.onsuccess = function () {
                          var value = req.result;
                          if (value === undefined) {
                              value = null;
                          }
                          if (_isEncodedBlob(value)) {
                              value = _decodeBlob(value);
                          }
                          resolve(value);
                      };

                      req.onerror = function () {
                          reject(req.error);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Iterate over all items stored in database.
  function iterate(iterator, callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var req = store.openCursor();
                      var iterationNumber = 1;

                      req.onsuccess = function () {
                          var cursor = req.result;

                          if (cursor) {
                              var value = cursor.value;
                              if (_isEncodedBlob(value)) {
                                  value = _decodeBlob(value);
                              }
                              var result = iterator(value, cursor.key, iterationNumber++);

                              // when the iterator callback retuns any
                              // (non-`undefined`) value, then we stop
                              // the iteration immediately
                              if (result !== void 0) {
                                  resolve(result);
                              } else {
                                  cursor["continue"]();
                              }
                          } else {
                              resolve();
                          }
                      };

                      req.onerror = function () {
                          reject(req.error);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);

      return promise;
  }

  function setItem(key, value, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          var dbInfo;
          self.ready().then(function () {
              dbInfo = self._dbInfo;
              if (toString.call(value) === '[object Blob]') {
                  return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                      if (blobSupport) {
                          return value;
                      }
                      return _encodeBlob(value);
                  });
              }
              return value;
          }).then(function (value) {
              createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);

                      // The reason we don't _save_ null is because IE 10 does
                      // not support saving the `null` type in IndexedDB. How
                      // ironic, given the bug below!
                      // See: https://github.com/mozilla/localForage/issues/161
                      if (value === null) {
                          value = undefined;
                      }

                      var req = store.put(value, key);

                      transaction.oncomplete = function () {
                          // Cast to undefined so the value passed to
                          // callback/promise is the same as what one would get out
                          // of `getItem()` later. This leads to some weirdness
                          // (setItem('foo', undefined) will return `null`), but
                          // it's not my fault localStorage is our baseline and that
                          // it's weird.
                          if (value === undefined) {
                              value = null;
                          }

                          resolve(value);
                      };
                      transaction.onabort = transaction.onerror = function () {
                          var err = req.error ? req.error : req.transaction.error;
                          reject(err);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function removeItem(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      // We use a Grunt task to make this safe for IE and some
                      // versions of Android (including those used by Cordova).
                      // Normally IE won't like `.delete()` and will insist on
                      // using `['delete']()`, but we have a build step that
                      // fixes this for us now.
                      var req = store["delete"](key);
                      transaction.oncomplete = function () {
                          resolve();
                      };

                      transaction.onerror = function () {
                          reject(req.error);
                      };

                      // The request will be also be aborted if we've exceeded our storage
                      // space.
                      transaction.onabort = function () {
                          var err = req.error ? req.error : req.transaction.error;
                          reject(err);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function clear(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var req = store.clear();

                      transaction.oncomplete = function () {
                          resolve();
                      };

                      transaction.onabort = transaction.onerror = function () {
                          var err = req.error ? req.error : req.transaction.error;
                          reject(err);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function length(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var req = store.count();

                      req.onsuccess = function () {
                          resolve(req.result);
                      };

                      req.onerror = function () {
                          reject(req.error);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function key(n, callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          if (n < 0) {
              resolve(null);

              return;
          }

          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var advanced = false;
                      var req = store.openCursor();

                      req.onsuccess = function () {
                          var cursor = req.result;
                          if (!cursor) {
                              // this means there weren't enough keys
                              resolve(null);

                              return;
                          }

                          if (n === 0) {
                              // We have the first key, return it if that's what they
                              // wanted.
                              resolve(cursor.key);
                          } else {
                              if (!advanced) {
                                  // Otherwise, ask the cursor to skip ahead n
                                  // records.
                                  advanced = true;
                                  cursor.advance(n);
                              } else {
                                  // When we get here, we've got the nth key.
                                  resolve(cursor.key);
                              }
                          }
                      };

                      req.onerror = function () {
                          reject(req.error);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function keys(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                  if (err) {
                      return reject(err);
                  }

                  try {
                      var store = transaction.objectStore(self._dbInfo.storeName);
                      var req = store.openCursor();
                      var keys = [];

                      req.onsuccess = function () {
                          var cursor = req.result;

                          if (!cursor) {
                              resolve(keys);
                              return;
                          }

                          keys.push(cursor.key);
                          cursor["continue"]();
                      };

                      req.onerror = function () {
                          reject(req.error);
                      };
                  } catch (e) {
                      reject(e);
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function dropInstance(options, callback) {
      callback = getCallback.apply(this, arguments);

      var currentConfig = this.config();
      options = typeof options !== 'function' && options || {};
      if (!options.name) {
          options.name = options.name || currentConfig.name;
          options.storeName = options.storeName || currentConfig.storeName;
      }

      var self = this;
      var promise;
      if (!options.name) {
          promise = Promise$1.reject('Invalid arguments');
      } else {
          var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

          var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
              var dbContext = dbContexts[options.name];
              var forages = dbContext.forages;
              dbContext.db = db;
              for (var i = 0; i < forages.length; i++) {
                  forages[i]._dbInfo.db = db;
              }
              return db;
          });

          if (!options.storeName) {
              promise = dbPromise.then(function (db) {
                  _deferReadiness(options);

                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;

                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                      var forage = forages[i];
                      forage._dbInfo.db = null;
                  }

                  var dropDBPromise = new Promise$1(function (resolve, reject) {
                      var req = idb.deleteDatabase(options.name);

                      req.onerror = req.onblocked = function (err) {
                          var db = req.result;
                          if (db) {
                              db.close();
                          }
                          reject(err);
                      };

                      req.onsuccess = function () {
                          var db = req.result;
                          if (db) {
                              db.close();
                          }
                          resolve(db);
                      };
                  });

                  return dropDBPromise.then(function (db) {
                      dbContext.db = db;
                      for (var i = 0; i < forages.length; i++) {
                          var _forage = forages[i];
                          _advanceReadiness(_forage._dbInfo);
                      }
                  })["catch"](function (err) {
                      (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                      throw err;
                  });
              });
          } else {
              promise = dbPromise.then(function (db) {
                  if (!db.objectStoreNames.contains(options.storeName)) {
                      return;
                  }

                  var newVersion = db.version + 1;

                  _deferReadiness(options);

                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;

                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                      var forage = forages[i];
                      forage._dbInfo.db = null;
                      forage._dbInfo.version = newVersion;
                  }

                  var dropObjectPromise = new Promise$1(function (resolve, reject) {
                      var req = idb.open(options.name, newVersion);

                      req.onerror = function (err) {
                          var db = req.result;
                          db.close();
                          reject(err);
                      };

                      req.onupgradeneeded = function () {
                          var db = req.result;
                          db.deleteObjectStore(options.storeName);
                      };

                      req.onsuccess = function () {
                          var db = req.result;
                          db.close();
                          resolve(db);
                      };
                  });

                  return dropObjectPromise.then(function (db) {
                      dbContext.db = db;
                      for (var j = 0; j < forages.length; j++) {
                          var _forage2 = forages[j];
                          _forage2._dbInfo.db = db;
                          _advanceReadiness(_forage2._dbInfo);
                      }
                  })["catch"](function (err) {
                      (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                      throw err;
                  });
              });
          }
      }

      executeCallback(promise, callback);
      return promise;
  }

  var asyncStorage = {
      _driver: 'asyncStorage',
      _initStorage: _initStorage,
      _support: isIndexedDBValid(),
      iterate: iterate,
      getItem: getItem,
      setItem: setItem,
      removeItem: removeItem,
      clear: clear,
      length: length,
      key: key,
      keys: keys,
      dropInstance: dropInstance
  };

  function isWebSQLValid() {
      return typeof openDatabase === 'function';
  }

  // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
  // it to Base64, so this is how we store it to prevent very strange errors with less
  // verbose ways of binary <-> string data storage.
  var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var BLOB_TYPE_PREFIX = '~~local_forage_type~';
  var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

  var SERIALIZED_MARKER = '__lfsc__:';
  var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

  // OMG the serializations!
  var TYPE_ARRAYBUFFER = 'arbf';
  var TYPE_BLOB = 'blob';
  var TYPE_INT8ARRAY = 'si08';
  var TYPE_UINT8ARRAY = 'ui08';
  var TYPE_UINT8CLAMPEDARRAY = 'uic8';
  var TYPE_INT16ARRAY = 'si16';
  var TYPE_INT32ARRAY = 'si32';
  var TYPE_UINT16ARRAY = 'ur16';
  var TYPE_UINT32ARRAY = 'ui32';
  var TYPE_FLOAT32ARRAY = 'fl32';
  var TYPE_FLOAT64ARRAY = 'fl64';
  var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

  var toString$1 = Object.prototype.toString;

  function stringToBuffer(serializedString) {
      // Fill the string into a ArrayBuffer.
      var bufferLength = serializedString.length * 0.75;
      var len = serializedString.length;
      var i;
      var p = 0;
      var encoded1, encoded2, encoded3, encoded4;

      if (serializedString[serializedString.length - 1] === '=') {
          bufferLength--;
          if (serializedString[serializedString.length - 2] === '=') {
              bufferLength--;
          }
      }

      var buffer = new ArrayBuffer(bufferLength);
      var bytes = new Uint8Array(buffer);

      for (i = 0; i < len; i += 4) {
          encoded1 = BASE_CHARS.indexOf(serializedString[i]);
          encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
          encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
          encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

          /*jslint bitwise: true */
          bytes[p++] = encoded1 << 2 | encoded2 >> 4;
          bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
          bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
      }
      return buffer;
  }

  // Converts a buffer to a string to store, serialized, in the backend
  // storage library.
  function bufferToString(buffer) {
      // base64-arraybuffer
      var bytes = new Uint8Array(buffer);
      var base64String = '';
      var i;

      for (i = 0; i < bytes.length; i += 3) {
          /*jslint bitwise: true */
          base64String += BASE_CHARS[bytes[i] >> 2];
          base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
          base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
          base64String += BASE_CHARS[bytes[i + 2] & 63];
      }

      if (bytes.length % 3 === 2) {
          base64String = base64String.substring(0, base64String.length - 1) + '=';
      } else if (bytes.length % 3 === 1) {
          base64String = base64String.substring(0, base64String.length - 2) + '==';
      }

      return base64String;
  }

  // Serialize a value, afterwards executing a callback (which usually
  // instructs the `setItem()` callback/promise to be executed). This is how
  // we store binary data with localStorage.
  function serialize(value, callback) {
      var valueType = '';
      if (value) {
          valueType = toString$1.call(value);
      }

      // Cannot use `value instanceof ArrayBuffer` or such here, as these
      // checks fail when running the tests using casper.js...
      //
      // TODO: See why those tests fail and use a better solution.
      if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
          // Convert binary arrays to a string and prefix the string with
          // a special marker.
          var buffer;
          var marker = SERIALIZED_MARKER;

          if (value instanceof ArrayBuffer) {
              buffer = value;
              marker += TYPE_ARRAYBUFFER;
          } else {
              buffer = value.buffer;

              if (valueType === '[object Int8Array]') {
                  marker += TYPE_INT8ARRAY;
              } else if (valueType === '[object Uint8Array]') {
                  marker += TYPE_UINT8ARRAY;
              } else if (valueType === '[object Uint8ClampedArray]') {
                  marker += TYPE_UINT8CLAMPEDARRAY;
              } else if (valueType === '[object Int16Array]') {
                  marker += TYPE_INT16ARRAY;
              } else if (valueType === '[object Uint16Array]') {
                  marker += TYPE_UINT16ARRAY;
              } else if (valueType === '[object Int32Array]') {
                  marker += TYPE_INT32ARRAY;
              } else if (valueType === '[object Uint32Array]') {
                  marker += TYPE_UINT32ARRAY;
              } else if (valueType === '[object Float32Array]') {
                  marker += TYPE_FLOAT32ARRAY;
              } else if (valueType === '[object Float64Array]') {
                  marker += TYPE_FLOAT64ARRAY;
              } else {
                  callback(new Error('Failed to get type for BinaryArray'));
              }
          }

          callback(marker + bufferToString(buffer));
      } else if (valueType === '[object Blob]') {
          // Conver the blob to a binaryArray and then to a string.
          var fileReader = new FileReader();

          fileReader.onload = function () {
              // Backwards-compatible prefix for the blob type.
              var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

              callback(SERIALIZED_MARKER + TYPE_BLOB + str);
          };

          fileReader.readAsArrayBuffer(value);
      } else {
          try {
              callback(JSON.stringify(value));
          } catch (e) {
              console.error("Couldn't convert value into a JSON string: ", value);

              callback(null, e);
          }
      }
  }

  // Deserialize data we've inserted into a value column/field. We place
  // special markers into our strings to mark them as encoded; this isn't
  // as nice as a meta field, but it's the only sane thing we can do whilst
  // keeping localStorage support intact.
  //
  // Oftentimes this will just deserialize JSON content, but if we have a
  // special marker (SERIALIZED_MARKER, defined above), we will extract
  // some kind of arraybuffer/binary data/typed array out of the string.
  function deserialize(value) {
      // If we haven't marked this string as being specially serialized (i.e.
      // something other than serialized JSON), we can just return it and be
      // done with it.
      if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
          return JSON.parse(value);
      }

      // The following code deals with deserializing some kind of Blob or
      // TypedArray. First we separate out the type of data we're dealing
      // with from the data itself.
      var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
      var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

      var blobType;
      // Backwards-compatible blob type serialization strategy.
      // DBs created with older versions of localForage will simply not have the blob type.
      if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
          var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
          blobType = matcher[1];
          serializedString = serializedString.substring(matcher[0].length);
      }
      var buffer = stringToBuffer(serializedString);

      // Return the right type based on the code/type set during
      // serialization.
      switch (type) {
          case TYPE_ARRAYBUFFER:
              return buffer;
          case TYPE_BLOB:
              return createBlob([buffer], { type: blobType });
          case TYPE_INT8ARRAY:
              return new Int8Array(buffer);
          case TYPE_UINT8ARRAY:
              return new Uint8Array(buffer);
          case TYPE_UINT8CLAMPEDARRAY:
              return new Uint8ClampedArray(buffer);
          case TYPE_INT16ARRAY:
              return new Int16Array(buffer);
          case TYPE_UINT16ARRAY:
              return new Uint16Array(buffer);
          case TYPE_INT32ARRAY:
              return new Int32Array(buffer);
          case TYPE_UINT32ARRAY:
              return new Uint32Array(buffer);
          case TYPE_FLOAT32ARRAY:
              return new Float32Array(buffer);
          case TYPE_FLOAT64ARRAY:
              return new Float64Array(buffer);
          default:
              throw new Error('Unkown type: ' + type);
      }
  }

  var localforageSerializer = {
      serialize: serialize,
      deserialize: deserialize,
      stringToBuffer: stringToBuffer,
      bufferToString: bufferToString
  };

  /*
   * Includes code from:
   *
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */

  function createDbTable(t, dbInfo, callback, errorCallback) {
      t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
  }

  // Open the WebSQL database (automatically creates one if one didn't
  // previously exist), using any options set in the config.
  function _initStorage$1(options) {
      var self = this;
      var dbInfo = {
          db: null
      };

      if (options) {
          for (var i in options) {
              dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
          }
      }

      var dbInfoPromise = new Promise$1(function (resolve, reject) {
          // Open the database; the openDatabase API will automatically
          // create it for us if it doesn't exist.
          try {
              dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
          } catch (e) {
              return reject(e);
          }

          // Create our key/value table if it doesn't exist.
          dbInfo.db.transaction(function (t) {
              createDbTable(t, dbInfo, function () {
                  self._dbInfo = dbInfo;
                  resolve();
              }, function (t, error) {
                  reject(error);
              });
          }, reject);
      });

      dbInfo.serializer = localforageSerializer;
      return dbInfoPromise;
  }

  function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
      t.executeSql(sqlStatement, args, callback, function (t, error) {
          if (error.code === error.SYNTAX_ERR) {
              t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                  if (!results.rows.length) {
                      // if the table is missing (was deleted)
                      // re-create it table and retry
                      createDbTable(t, dbInfo, function () {
                          t.executeSql(sqlStatement, args, callback, errorCallback);
                      }, errorCallback);
                  } else {
                      errorCallback(t, error);
                  }
              }, errorCallback);
          } else {
              errorCallback(t, error);
          }
      }, errorCallback);
  }

  function getItem$1(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                      var result = results.rows.length ? results.rows.item(0).value : null;

                      // Check to see if this is serialized content we need to
                      // unpack.
                      if (result) {
                          result = dbInfo.serializer.deserialize(result);
                      }

                      resolve(result);
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function iterate$1(iterator, callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;

              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                      var rows = results.rows;
                      var length = rows.length;

                      for (var i = 0; i < length; i++) {
                          var item = rows.item(i);
                          var result = item.value;

                          // Check to see if this is serialized content
                          // we need to unpack.
                          if (result) {
                              result = dbInfo.serializer.deserialize(result);
                          }

                          result = iterator(result, item.key, i + 1);

                          // void(0) prevents problems with redefinition
                          // of `undefined`.
                          if (result !== void 0) {
                              resolve(result);
                              return;
                          }
                      }

                      resolve();
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function _setItem(key, value, callback, retriesLeft) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              // The localStorage API doesn't return undefined values in an
              // "expected" way, so undefined is always cast to null in all
              // drivers. See: https://github.com/mozilla/localForage/pull/42
              if (value === undefined) {
                  value = null;
              }

              // Save the original value to pass to the callback.
              var originalValue = value;

              var dbInfo = self._dbInfo;
              dbInfo.serializer.serialize(value, function (value, error) {
                  if (error) {
                      reject(error);
                  } else {
                      dbInfo.db.transaction(function (t) {
                          tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                              resolve(originalValue);
                          }, function (t, error) {
                              reject(error);
                          });
                      }, function (sqlError) {
                          // The transaction failed; check
                          // to see if it's a quota error.
                          if (sqlError.code === sqlError.QUOTA_ERR) {
                              // We reject the callback outright for now, but
                              // it's worth trying to re-run the transaction.
                              // Even if the user accepts the prompt to use
                              // more storage on Safari, this error will
                              // be called.
                              //
                              // Try to re-run the transaction.
                              if (retriesLeft > 0) {
                                  resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                  return;
                              }
                              reject(sqlError);
                          }
                      });
                  }
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function setItem$1(key, value, callback) {
      return _setItem.apply(this, [key, value, callback, 1]);
  }

  function removeItem$1(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                      resolve();
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Deletes every item in the table.
  // TODO: Find out if this resets the AUTO_INCREMENT number.
  function clear$1(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                      resolve();
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Does a simple `COUNT(key)` to get the number of items stored in
  // localForage.
  function length$1(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  // Ahhh, SQL makes this one soooooo easy.
                  tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                      var result = results.rows.item(0).c;
                      resolve(result);
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Return the key located at key index X; essentially gets the key from a
  // `WHERE id = ?`. This is the most efficient way I can think to implement
  // this rarely-used (in my experience) part of the API, but it can seem
  // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
  // the ID of each key will change every time it's updated. Perhaps a stored
  // procedure for the `setItem()` SQL would solve this problem?
  // TODO: Don't change ID on `setItem()`.
  function key$1(n, callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                      var result = results.rows.length ? results.rows.item(0).key : null;
                      resolve(result);
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  function keys$1(callback) {
      var self = this;

      var promise = new Promise$1(function (resolve, reject) {
          self.ready().then(function () {
              var dbInfo = self._dbInfo;
              dbInfo.db.transaction(function (t) {
                  tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                      var keys = [];

                      for (var i = 0; i < results.rows.length; i++) {
                          keys.push(results.rows.item(i).key);
                      }

                      resolve(keys);
                  }, function (t, error) {
                      reject(error);
                  });
              });
          })["catch"](reject);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // https://www.w3.org/TR/webdatabase/#databases
  // > There is no way to enumerate or delete the databases available for an origin from this API.
  function getAllStoreNames(db) {
      return new Promise$1(function (resolve, reject) {
          db.transaction(function (t) {
              t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                  var storeNames = [];

                  for (var i = 0; i < results.rows.length; i++) {
                      storeNames.push(results.rows.item(i).name);
                  }

                  resolve({
                      db: db,
                      storeNames: storeNames
                  });
              }, function (t, error) {
                  reject(error);
              });
          }, function (sqlError) {
              reject(sqlError);
          });
      });
  }

  function dropInstance$1(options, callback) {
      callback = getCallback.apply(this, arguments);

      var currentConfig = this.config();
      options = typeof options !== 'function' && options || {};
      if (!options.name) {
          options.name = options.name || currentConfig.name;
          options.storeName = options.storeName || currentConfig.storeName;
      }

      var self = this;
      var promise;
      if (!options.name) {
          promise = Promise$1.reject('Invalid arguments');
      } else {
          promise = new Promise$1(function (resolve) {
              var db;
              if (options.name === currentConfig.name) {
                  // use the db reference of the current instance
                  db = self._dbInfo.db;
              } else {
                  db = openDatabase(options.name, '', '', 0);
              }

              if (!options.storeName) {
                  // drop all database tables
                  resolve(getAllStoreNames(db));
              } else {
                  resolve({
                      db: db,
                      storeNames: [options.storeName]
                  });
              }
          }).then(function (operationInfo) {
              return new Promise$1(function (resolve, reject) {
                  operationInfo.db.transaction(function (t) {
                      function dropTable(storeName) {
                          return new Promise$1(function (resolve, reject) {
                              t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                  resolve();
                              }, function (t, error) {
                                  reject(error);
                              });
                          });
                      }

                      var operations = [];
                      for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                          operations.push(dropTable(operationInfo.storeNames[i]));
                      }

                      Promise$1.all(operations).then(function () {
                          resolve();
                      })["catch"](function (e) {
                          reject(e);
                      });
                  }, function (sqlError) {
                      reject(sqlError);
                  });
              });
          });
      }

      executeCallback(promise, callback);
      return promise;
  }

  var webSQLStorage = {
      _driver: 'webSQLStorage',
      _initStorage: _initStorage$1,
      _support: isWebSQLValid(),
      iterate: iterate$1,
      getItem: getItem$1,
      setItem: setItem$1,
      removeItem: removeItem$1,
      clear: clear$1,
      length: length$1,
      key: key$1,
      keys: keys$1,
      dropInstance: dropInstance$1
  };

  function isLocalStorageValid() {
      try {
          return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
          // in IE8 typeof localStorage.setItem === 'object'
          !!localStorage.setItem;
      } catch (e) {
          return false;
      }
  }

  function _getKeyPrefix(options, defaultConfig) {
      var keyPrefix = options.name + '/';

      if (options.storeName !== defaultConfig.storeName) {
          keyPrefix += options.storeName + '/';
      }
      return keyPrefix;
  }

  // Check if localStorage throws when saving an item
  function checkIfLocalStorageThrows() {
      var localStorageTestKey = '_localforage_support_test';

      try {
          localStorage.setItem(localStorageTestKey, true);
          localStorage.removeItem(localStorageTestKey);

          return false;
      } catch (e) {
          return true;
      }
  }

  // Check if localStorage is usable and allows to save an item
  // This method checks if localStorage is usable in Safari Private Browsing
  // mode, or in any other case where the available quota for localStorage
  // is 0 and there wasn't any saved items yet.
  function _isLocalStorageUsable() {
      return !checkIfLocalStorageThrows() || localStorage.length > 0;
  }

  // Config the localStorage backend, using options set in the config.
  function _initStorage$2(options) {
      var self = this;
      var dbInfo = {};
      if (options) {
          for (var i in options) {
              dbInfo[i] = options[i];
          }
      }

      dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

      if (!_isLocalStorageUsable()) {
          return Promise$1.reject();
      }

      self._dbInfo = dbInfo;
      dbInfo.serializer = localforageSerializer;

      return Promise$1.resolve();
  }

  // Remove all keys from the datastore, effectively destroying all data in
  // the app's key/value store!
  function clear$2(callback) {
      var self = this;
      var promise = self.ready().then(function () {
          var keyPrefix = self._dbInfo.keyPrefix;

          for (var i = localStorage.length - 1; i >= 0; i--) {
              var key = localStorage.key(i);

              if (key.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key);
              }
          }
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Retrieve an item from the store. Unlike the original async_storage
  // library in Gaia, we don't modify return values at all. If a key's value
  // is `undefined`, we pass that value to the callback function.
  function getItem$2(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = self.ready().then(function () {
          var dbInfo = self._dbInfo;
          var result = localStorage.getItem(dbInfo.keyPrefix + key);

          // If a result was found, parse it from the serialized
          // string into a JS object. If result isn't truthy, the key
          // is likely undefined and we'll pass it straight to the
          // callback.
          if (result) {
              result = dbInfo.serializer.deserialize(result);
          }

          return result;
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Iterate over all items in the store.
  function iterate$2(iterator, callback) {
      var self = this;

      var promise = self.ready().then(function () {
          var dbInfo = self._dbInfo;
          var keyPrefix = dbInfo.keyPrefix;
          var keyPrefixLength = keyPrefix.length;
          var length = localStorage.length;

          // We use a dedicated iterator instead of the `i` variable below
          // so other keys we fetch in localStorage aren't counted in
          // the `iterationNumber` argument passed to the `iterate()`
          // callback.
          //
          // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
          var iterationNumber = 1;

          for (var i = 0; i < length; i++) {
              var key = localStorage.key(i);
              if (key.indexOf(keyPrefix) !== 0) {
                  continue;
              }
              var value = localStorage.getItem(key);

              // If a result was found, parse it from the serialized
              // string into a JS object. If result isn't truthy, the
              // key is likely undefined and we'll pass it straight
              // to the iterator.
              if (value) {
                  value = dbInfo.serializer.deserialize(value);
              }

              value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

              if (value !== void 0) {
                  return value;
              }
          }
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Same as localStorage's key() method, except takes a callback.
  function key$2(n, callback) {
      var self = this;
      var promise = self.ready().then(function () {
          var dbInfo = self._dbInfo;
          var result;
          try {
              result = localStorage.key(n);
          } catch (error) {
              result = null;
          }

          // Remove the prefix from the key, if a key is found.
          if (result) {
              result = result.substring(dbInfo.keyPrefix.length);
          }

          return result;
      });

      executeCallback(promise, callback);
      return promise;
  }

  function keys$2(callback) {
      var self = this;
      var promise = self.ready().then(function () {
          var dbInfo = self._dbInfo;
          var length = localStorage.length;
          var keys = [];

          for (var i = 0; i < length; i++) {
              var itemKey = localStorage.key(i);
              if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                  keys.push(itemKey.substring(dbInfo.keyPrefix.length));
              }
          }

          return keys;
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Supply the number of keys in the datastore to the callback function.
  function length$2(callback) {
      var self = this;
      var promise = self.keys().then(function (keys) {
          return keys.length;
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Remove an item from the store, nice and simple.
  function removeItem$2(key, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = self.ready().then(function () {
          var dbInfo = self._dbInfo;
          localStorage.removeItem(dbInfo.keyPrefix + key);
      });

      executeCallback(promise, callback);
      return promise;
  }

  // Set a key's value and run an optional callback once the value is set.
  // Unlike Gaia's implementation, the callback function is passed the value,
  // in case you want to operate on that value only after you're sure it
  // saved, or something like that.
  function setItem$2(key, value, callback) {
      var self = this;

      key = normalizeKey(key);

      var promise = self.ready().then(function () {
          // Convert undefined values to null.
          // https://github.com/mozilla/localForage/pull/42
          if (value === undefined) {
              value = null;
          }

          // Save the original value to pass to the callback.
          var originalValue = value;

          return new Promise$1(function (resolve, reject) {
              var dbInfo = self._dbInfo;
              dbInfo.serializer.serialize(value, function (value, error) {
                  if (error) {
                      reject(error);
                  } else {
                      try {
                          localStorage.setItem(dbInfo.keyPrefix + key, value);
                          resolve(originalValue);
                      } catch (e) {
                          // localStorage capacity exceeded.
                          // TODO: Make this a specific error/event.
                          if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                              reject(e);
                          }
                          reject(e);
                      }
                  }
              });
          });
      });

      executeCallback(promise, callback);
      return promise;
  }

  function dropInstance$2(options, callback) {
      callback = getCallback.apply(this, arguments);

      options = typeof options !== 'function' && options || {};
      if (!options.name) {
          var currentConfig = this.config();
          options.name = options.name || currentConfig.name;
          options.storeName = options.storeName || currentConfig.storeName;
      }

      var self = this;
      var promise;
      if (!options.name) {
          promise = Promise$1.reject('Invalid arguments');
      } else {
          promise = new Promise$1(function (resolve) {
              if (!options.storeName) {
                  resolve(options.name + '/');
              } else {
                  resolve(_getKeyPrefix(options, self._defaultConfig));
              }
          }).then(function (keyPrefix) {
              for (var i = localStorage.length - 1; i >= 0; i--) {
                  var key = localStorage.key(i);

                  if (key.indexOf(keyPrefix) === 0) {
                      localStorage.removeItem(key);
                  }
              }
          });
      }

      executeCallback(promise, callback);
      return promise;
  }

  var localStorageWrapper = {
      _driver: 'localStorageWrapper',
      _initStorage: _initStorage$2,
      _support: isLocalStorageValid(),
      iterate: iterate$2,
      getItem: getItem$2,
      setItem: setItem$2,
      removeItem: removeItem$2,
      clear: clear$2,
      length: length$2,
      key: key$2,
      keys: keys$2,
      dropInstance: dropInstance$2
  };

  var sameValue = function sameValue(x, y) {
      return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
  };

  var includes = function includes(array, searchElement) {
      var len = array.length;
      var i = 0;
      while (i < len) {
          if (sameValue(array[i], searchElement)) {
              return true;
          }
          i++;
      }

      return false;
  };

  var isArray = Array.isArray || function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
  };

  // Drivers are stored here when `defineDriver()` is called.
  // They are shared across all instances of localForage.
  var DefinedDrivers = {};

  var DriverSupport = {};

  var DefaultDrivers = {
      INDEXEDDB: asyncStorage,
      WEBSQL: webSQLStorage,
      LOCALSTORAGE: localStorageWrapper
  };

  var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

  var OptionalDriverMethods = ['dropInstance'];

  var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

  var DefaultConfig = {
      description: '',
      driver: DefaultDriverOrder.slice(),
      name: 'localforage',
      // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
      // we can use without a prompt.
      size: 4980736,
      storeName: 'keyvaluepairs',
      version: 1.0
  };

  function callWhenReady(localForageInstance, libraryMethod) {
      localForageInstance[libraryMethod] = function () {
          var _args = arguments;
          return localForageInstance.ready().then(function () {
              return localForageInstance[libraryMethod].apply(localForageInstance, _args);
          });
      };
  }

  function extend() {
      for (var i = 1; i < arguments.length; i++) {
          var arg = arguments[i];

          if (arg) {
              for (var _key in arg) {
                  if (arg.hasOwnProperty(_key)) {
                      if (isArray(arg[_key])) {
                          arguments[0][_key] = arg[_key].slice();
                      } else {
                          arguments[0][_key] = arg[_key];
                      }
                  }
              }
          }
      }

      return arguments[0];
  }

  var LocalForage = function () {
      function LocalForage(options) {
          _classCallCheck(this, LocalForage);

          for (var driverTypeKey in DefaultDrivers) {
              if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                  var driver = DefaultDrivers[driverTypeKey];
                  var driverName = driver._driver;
                  this[driverTypeKey] = driverName;

                  if (!DefinedDrivers[driverName]) {
                      // we don't need to wait for the promise,
                      // since the default drivers can be defined
                      // in a blocking manner
                      this.defineDriver(driver);
                  }
              }
          }

          this._defaultConfig = extend({}, DefaultConfig);
          this._config = extend({}, this._defaultConfig, options);
          this._driverSet = null;
          this._initDriver = null;
          this._ready = false;
          this._dbInfo = null;

          this._wrapLibraryMethodsWithReady();
          this.setDriver(this._config.driver)["catch"](function () {});
      }

      // Set any config values for localForage; can be called anytime before
      // the first API call (e.g. `getItem`, `setItem`).
      // We loop through options so we don't overwrite existing config
      // values.


      LocalForage.prototype.config = function config(options) {
          // If the options argument is an object, we use it to set values.
          // Otherwise, we return either a specified config value or all
          // config values.
          if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
              // If localforage is ready and fully initialized, we can't set
              // any new configuration values. Instead, we return an error.
              if (this._ready) {
                  return new Error("Can't call config() after localforage " + 'has been used.');
              }

              for (var i in options) {
                  if (i === 'storeName') {
                      options[i] = options[i].replace(/\W/g, '_');
                  }

                  if (i === 'version' && typeof options[i] !== 'number') {
                      return new Error('Database version must be a number.');
                  }

                  this._config[i] = options[i];
              }

              // after all config options are set and
              // the driver option is used, try setting it
              if ('driver' in options && options.driver) {
                  return this.setDriver(this._config.driver);
              }

              return true;
          } else if (typeof options === 'string') {
              return this._config[options];
          } else {
              return this._config;
          }
      };

      // Used to define a custom driver, shared across all instances of
      // localForage.


      LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
          var promise = new Promise$1(function (resolve, reject) {
              try {
                  var driverName = driverObject._driver;
                  var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                  // A driver name should be defined and not overlap with the
                  // library-defined, default drivers.
                  if (!driverObject._driver) {
                      reject(complianceError);
                      return;
                  }

                  var driverMethods = LibraryMethods.concat('_initStorage');
                  for (var i = 0, len = driverMethods.length; i < len; i++) {
                      var driverMethodName = driverMethods[i];

                      // when the property is there,
                      // it should be a method even when optional
                      var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                      if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                          reject(complianceError);
                          return;
                      }
                  }

                  var configureMissingMethods = function configureMissingMethods() {
                      var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                          return function () {
                              var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                              var promise = Promise$1.reject(error);
                              executeCallback(promise, arguments[arguments.length - 1]);
                              return promise;
                          };
                      };

                      for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                          var optionalDriverMethod = OptionalDriverMethods[_i];
                          if (!driverObject[optionalDriverMethod]) {
                              driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                          }
                      }
                  };

                  configureMissingMethods();

                  var setDriverSupport = function setDriverSupport(support) {
                      if (DefinedDrivers[driverName]) {
                          console.info('Redefining LocalForage driver: ' + driverName);
                      }
                      DefinedDrivers[driverName] = driverObject;
                      DriverSupport[driverName] = support;
                      // don't use a then, so that we can define
                      // drivers that have simple _support methods
                      // in a blocking manner
                      resolve();
                  };

                  if ('_support' in driverObject) {
                      if (driverObject._support && typeof driverObject._support === 'function') {
                          driverObject._support().then(setDriverSupport, reject);
                      } else {
                          setDriverSupport(!!driverObject._support);
                      }
                  } else {
                      setDriverSupport(true);
                  }
              } catch (e) {
                  reject(e);
              }
          });

          executeTwoCallbacks(promise, callback, errorCallback);
          return promise;
      };

      LocalForage.prototype.driver = function driver() {
          return this._driver || null;
      };

      LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
          var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

          executeTwoCallbacks(getDriverPromise, callback, errorCallback);
          return getDriverPromise;
      };

      LocalForage.prototype.getSerializer = function getSerializer(callback) {
          var serializerPromise = Promise$1.resolve(localforageSerializer);
          executeTwoCallbacks(serializerPromise, callback);
          return serializerPromise;
      };

      LocalForage.prototype.ready = function ready(callback) {
          var self = this;

          var promise = self._driverSet.then(function () {
              if (self._ready === null) {
                  self._ready = self._initDriver();
              }

              return self._ready;
          });

          executeTwoCallbacks(promise, callback, callback);
          return promise;
      };

      LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
          var self = this;

          if (!isArray(drivers)) {
              drivers = [drivers];
          }

          var supportedDrivers = this._getSupportedDrivers(drivers);

          function setDriverToConfig() {
              self._config.driver = self.driver();
          }

          function extendSelfWithDriver(driver) {
              self._extend(driver);
              setDriverToConfig();

              self._ready = self._initStorage(self._config);
              return self._ready;
          }

          function initDriver(supportedDrivers) {
              return function () {
                  var currentDriverIndex = 0;

                  function driverPromiseLoop() {
                      while (currentDriverIndex < supportedDrivers.length) {
                          var driverName = supportedDrivers[currentDriverIndex];
                          currentDriverIndex++;

                          self._dbInfo = null;
                          self._ready = null;

                          return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                      }

                      setDriverToConfig();
                      var error = new Error('No available storage method found.');
                      self._driverSet = Promise$1.reject(error);
                      return self._driverSet;
                  }

                  return driverPromiseLoop();
              };
          }

          // There might be a driver initialization in progress
          // so wait for it to finish in order to avoid a possible
          // race condition to set _dbInfo
          var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
              return Promise$1.resolve();
          }) : Promise$1.resolve();

          this._driverSet = oldDriverSetDone.then(function () {
              var driverName = supportedDrivers[0];
              self._dbInfo = null;
              self._ready = null;

              return self.getDriver(driverName).then(function (driver) {
                  self._driver = driver._driver;
                  setDriverToConfig();
                  self._wrapLibraryMethodsWithReady();
                  self._initDriver = initDriver(supportedDrivers);
              });
          })["catch"](function () {
              setDriverToConfig();
              var error = new Error('No available storage method found.');
              self._driverSet = Promise$1.reject(error);
              return self._driverSet;
          });

          executeTwoCallbacks(this._driverSet, callback, errorCallback);
          return this._driverSet;
      };

      LocalForage.prototype.supports = function supports(driverName) {
          return !!DriverSupport[driverName];
      };

      LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
          extend(this, libraryMethodsAndProperties);
      };

      LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
          var supportedDrivers = [];
          for (var i = 0, len = drivers.length; i < len; i++) {
              var driverName = drivers[i];
              if (this.supports(driverName)) {
                  supportedDrivers.push(driverName);
              }
          }
          return supportedDrivers;
      };

      LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
          // Add a stub for each driver API method that delays the call to the
          // corresponding driver method until localForage is ready. These stubs
          // will be replaced by the driver methods as soon as the driver is
          // loaded, so there is no performance impact.
          for (var i = 0, len = LibraryMethods.length; i < len; i++) {
              callWhenReady(this, LibraryMethods[i]);
          }
      };

      LocalForage.prototype.createInstance = function createInstance(options) {
          return new LocalForage(options);
      };

      return LocalForage;
  }();

  // The actual localForage object that we expose as a module or via a
  // global. It's extended by pulling in one of our other libraries.


  var localforage_js = new LocalForage();

  module.exports = localforage_js;

  },{"3":3}]},{},[4])(4)
  });
  });

  /* global self */
  const watchers = new Set();
  const log = async entry => {
    if (isWebWorker) {
      return self.ask({
        log: {
          entry
        }
      });
    }

    for (const watcher of watchers) {
      watcher(entry);
    }
  };

  const word = '[a-fA-F\\d:]';
  const b = options => options && options.includeBoundaries ?
  	`(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` :
  	'';

  const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

  const v6seg = '[a-fA-F\\d]{1,4}';
  const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

  const ip = options => options && options.exact ?
  	new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
  	new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');

  ip.v4 = options => options && options.exact ? new RegExp(`^${v4}$`) : new RegExp(`${b(options)}${v4}${b(options)}`, 'g');
  ip.v6 = options => options && options.exact ? new RegExp(`^${v6}$`) : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');

  var ipRegex = ip;

  var tlds = [
    "aaa",
    "aarp",
    "abarth",
    "abb",
    "abbott",
    "abbvie",
    "abc",
    "able",
    "abogado",
    "abudhabi",
    "ac",
    "academy",
    "accenture",
    "accountant",
    "accountants",
    "aco",
    "active",
    "actor",
    "ad",
    "adac",
    "ads",
    "adult",
    "ae",
    "aeg",
    "aero",
    "aetna",
    "af",
    "afamilycompany",
    "afl",
    "africa",
    "ag",
    "agakhan",
    "agency",
    "ai",
    "aig",
    "aigo",
    "airbus",
    "airforce",
    "airtel",
    "akdn",
    "al",
    "alfaromeo",
    "alibaba",
    "alipay",
    "allfinanz",
    "allstate",
    "ally",
    "alsace",
    "alstom",
    "am",
    "americanexpress",
    "americanfamily",
    "amex",
    "amfam",
    "amica",
    "amsterdam",
    "analytics",
    "android",
    "anquan",
    "anz",
    "ao",
    "aol",
    "apartments",
    "app",
    "apple",
    "aq",
    "aquarelle",
    "ar",
    "arab",
    "aramco",
    "archi",
    "army",
    "arpa",
    "art",
    "arte",
    "as",
    "asda",
    "asia",
    "associates",
    "at",
    "athleta",
    "attorney",
    "au",
    "auction",
    "audi",
    "audible",
    "audio",
    "auspost",
    "author",
    "auto",
    "autos",
    "avianca",
    "aw",
    "aws",
    "ax",
    "axa",
    "az",
    "azure",
    "ba",
    "baby",
    "baidu",
    "banamex",
    "bananarepublic",
    "band",
    "bank",
    "bar",
    "barcelona",
    "barclaycard",
    "barclays",
    "barefoot",
    "bargains",
    "baseball",
    "basketball",
    "bauhaus",
    "bayern",
    "bb",
    "bbc",
    "bbt",
    "bbva",
    "bcg",
    "bcn",
    "bd",
    "be",
    "beats",
    "beauty",
    "beer",
    "bentley",
    "berlin",
    "best",
    "bestbuy",
    "bet",
    "bf",
    "bg",
    "bh",
    "bharti",
    "bi",
    "bible",
    "bid",
    "bike",
    "bing",
    "bingo",
    "bio",
    "biz",
    "bj",
    "black",
    "blackfriday",
    "blanco",
    "blockbuster",
    "blog",
    "bloomberg",
    "blue",
    "bm",
    "bms",
    "bmw",
    "bn",
    "bnl",
    "bnpparibas",
    "bo",
    "boats",
    "boehringer",
    "bofa",
    "bom",
    "bond",
    "boo",
    "book",
    "booking",
    "bosch",
    "bostik",
    "boston",
    "bot",
    "boutique",
    "box",
    "br",
    "bradesco",
    "bridgestone",
    "broadway",
    "broker",
    "brother",
    "brussels",
    "bs",
    "bt",
    "budapest",
    "bugatti",
    "build",
    "builders",
    "business",
    "buy",
    "buzz",
    "bv",
    "bw",
    "by",
    "bz",
    "bzh",
    "ca",
    "cab",
    "cafe",
    "cal",
    "call",
    "calvinklein",
    "cam",
    "camera",
    "camp",
    "cancerresearch",
    "canon",
    "capetown",
    "capital",
    "capitalone",
    "car",
    "caravan",
    "cards",
    "care",
    "career",
    "careers",
    "cars",
    "cartier",
    "casa",
    "case",
    "caseih",
    "cash",
    "casino",
    "cat",
    "catering",
    "catholic",
    "cba",
    "cbn",
    "cbre",
    "cbs",
    "cc",
    "cd",
    "ceb",
    "center",
    "ceo",
    "cern",
    "cf",
    "cfa",
    "cfd",
    "cg",
    "ch",
    "chanel",
    "channel",
    "chase",
    "chat",
    "cheap",
    "chintai",
    "christmas",
    "chrome",
    "chrysler",
    "church",
    "ci",
    "cipriani",
    "circle",
    "cisco",
    "citadel",
    "citi",
    "citic",
    "city",
    "cityeats",
    "ck",
    "cl",
    "claims",
    "cleaning",
    "click",
    "clinic",
    "clinique",
    "clothing",
    "cloud",
    "club",
    "clubmed",
    "cm",
    "cn",
    "co",
    "coach",
    "codes",
    "coffee",
    "college",
    "cologne",
    "com",
    "comcast",
    "commbank",
    "community",
    "company",
    "compare",
    "computer",
    "comsec",
    "condos",
    "construction",
    "consulting",
    "contact",
    "contractors",
    "cooking",
    "cookingchannel",
    "cool",
    "coop",
    "corsica",
    "country",
    "coupon",
    "coupons",
    "courses",
    "cr",
    "credit",
    "creditcard",
    "creditunion",
    "cricket",
    "crown",
    "crs",
    "cruise",
    "cruises",
    "csc",
    "cu",
    "cuisinella",
    "cv",
    "cw",
    "cx",
    "cy",
    "cymru",
    "cyou",
    "cz",
    "dabur",
    "dad",
    "dance",
    "data",
    "date",
    "dating",
    "datsun",
    "day",
    "dclk",
    "dds",
    "de",
    "deal",
    "dealer",
    "deals",
    "degree",
    "delivery",
    "dell",
    "deloitte",
    "delta",
    "democrat",
    "dental",
    "dentist",
    "desi",
    "design",
    "dev",
    "dhl",
    "diamonds",
    "diet",
    "digital",
    "direct",
    "directory",
    "discount",
    "discover",
    "dish",
    "diy",
    "dj",
    "dk",
    "dm",
    "dnp",
    "do",
    "docs",
    "doctor",
    "dodge",
    "dog",
    "doha",
    "domains",
    "dot",
    "download",
    "drive",
    "dtv",
    "dubai",
    "duck",
    "dunlop",
    "duns",
    "dupont",
    "durban",
    "dvag",
    "dvr",
    "dz",
    "earth",
    "eat",
    "ec",
    "eco",
    "edeka",
    "edu",
    "education",
    "ee",
    "eg",
    "email",
    "emerck",
    "energy",
    "engineer",
    "engineering",
    "enterprises",
    "epost",
    "epson",
    "equipment",
    "er",
    "ericsson",
    "erni",
    "es",
    "esq",
    "estate",
    "esurance",
    "et",
    "etisalat",
    "eu",
    "eurovision",
    "eus",
    "events",
    "everbank",
    "exchange",
    "expert",
    "exposed",
    "express",
    "extraspace",
    "fage",
    "fail",
    "fairwinds",
    "faith",
    "family",
    "fan",
    "fans",
    "farm",
    "farmers",
    "fashion",
    "fast",
    "fedex",
    "feedback",
    "ferrari",
    "ferrero",
    "fi",
    "fiat",
    "fidelity",
    "fido",
    "film",
    "final",
    "finance",
    "financial",
    "fire",
    "firestone",
    "firmdale",
    "fish",
    "fishing",
    "fit",
    "fitness",
    "fj",
    "fk",
    "flickr",
    "flights",
    "flir",
    "florist",
    "flowers",
    "fly",
    "fm",
    "fo",
    "foo",
    "food",
    "foodnetwork",
    "football",
    "ford",
    "forex",
    "forsale",
    "forum",
    "foundation",
    "fox",
    "fr",
    "free",
    "fresenius",
    "frl",
    "frogans",
    "frontdoor",
    "frontier",
    "ftr",
    "fujitsu",
    "fujixerox",
    "fun",
    "fund",
    "furniture",
    "futbol",
    "fyi",
    "ga",
    "gal",
    "gallery",
    "gallo",
    "gallup",
    "game",
    "games",
    "gap",
    "garden",
    "gb",
    "gbiz",
    "gd",
    "gdn",
    "ge",
    "gea",
    "gent",
    "genting",
    "george",
    "gf",
    "gg",
    "ggee",
    "gh",
    "gi",
    "gift",
    "gifts",
    "gives",
    "giving",
    "gl",
    "glade",
    "glass",
    "gle",
    "global",
    "globo",
    "gm",
    "gmail",
    "gmbh",
    "gmo",
    "gmx",
    "gn",
    "godaddy",
    "gold",
    "goldpoint",
    "golf",
    "goo",
    "goodhands",
    "goodyear",
    "goog",
    "google",
    "gop",
    "got",
    "gov",
    "gp",
    "gq",
    "gr",
    "grainger",
    "graphics",
    "gratis",
    "green",
    "gripe",
    "grocery",
    "group",
    "gs",
    "gt",
    "gu",
    "guardian",
    "gucci",
    "guge",
    "guide",
    "guitars",
    "guru",
    "gw",
    "gy",
    "hair",
    "hamburg",
    "hangout",
    "haus",
    "hbo",
    "hdfc",
    "hdfcbank",
    "health",
    "healthcare",
    "help",
    "helsinki",
    "here",
    "hermes",
    "hgtv",
    "hiphop",
    "hisamitsu",
    "hitachi",
    "hiv",
    "hk",
    "hkt",
    "hm",
    "hn",
    "hockey",
    "holdings",
    "holiday",
    "homedepot",
    "homegoods",
    "homes",
    "homesense",
    "honda",
    "honeywell",
    "horse",
    "hospital",
    "host",
    "hosting",
    "hot",
    "hoteles",
    "hotels",
    "hotmail",
    "house",
    "how",
    "hr",
    "hsbc",
    "ht",
    "hu",
    "hughes",
    "hyatt",
    "hyundai",
    "ibm",
    "icbc",
    "ice",
    "icu",
    "id",
    "ie",
    "ieee",
    "ifm",
    "ikano",
    "il",
    "im",
    "imamat",
    "imdb",
    "immo",
    "immobilien",
    "in",
    "industries",
    "infiniti",
    "info",
    "ing",
    "ink",
    "institute",
    "insurance",
    "insure",
    "int",
    "intel",
    "international",
    "intuit",
    "investments",
    "io",
    "ipiranga",
    "iq",
    "ir",
    "irish",
    "is",
    "iselect",
    "ismaili",
    "ist",
    "istanbul",
    "it",
    "itau",
    "itv",
    "iveco",
    "iwc",
    "jaguar",
    "java",
    "jcb",
    "jcp",
    "je",
    "jeep",
    "jetzt",
    "jewelry",
    "jio",
    "jlc",
    "jll",
    "jm",
    "jmp",
    "jnj",
    "jo",
    "jobs",
    "joburg",
    "jot",
    "joy",
    "jp",
    "jpmorgan",
    "jprs",
    "juegos",
    "juniper",
    "kaufen",
    "kddi",
    "ke",
    "kerryhotels",
    "kerrylogistics",
    "kerryproperties",
    "kfh",
    "kg",
    "kh",
    "ki",
    "kia",
    "kim",
    "kinder",
    "kindle",
    "kitchen",
    "kiwi",
    "km",
    "kn",
    "koeln",
    "komatsu",
    "kosher",
    "kp",
    "kpmg",
    "kpn",
    "kr",
    "krd",
    "kred",
    "kuokgroup",
    "kw",
    "ky",
    "kyoto",
    "kz",
    "la",
    "lacaixa",
    "ladbrokes",
    "lamborghini",
    "lamer",
    "lancaster",
    "lancia",
    "lancome",
    "land",
    "landrover",
    "lanxess",
    "lasalle",
    "lat",
    "latino",
    "latrobe",
    "law",
    "lawyer",
    "lb",
    "lc",
    "lds",
    "lease",
    "leclerc",
    "lefrak",
    "legal",
    "lego",
    "lexus",
    "lgbt",
    "li",
    "liaison",
    "lidl",
    "life",
    "lifeinsurance",
    "lifestyle",
    "lighting",
    "like",
    "lilly",
    "limited",
    "limo",
    "lincoln",
    "linde",
    "link",
    "lipsy",
    "live",
    "living",
    "lixil",
    "lk",
    "llc",
    "loan",
    "loans",
    "locker",
    "locus",
    "loft",
    "lol",
    "london",
    "lotte",
    "lotto",
    "love",
    "lpl",
    "lplfinancial",
    "lr",
    "ls",
    "lt",
    "ltd",
    "ltda",
    "lu",
    "lundbeck",
    "lupin",
    "luxe",
    "luxury",
    "lv",
    "ly",
    "ma",
    "macys",
    "madrid",
    "maif",
    "maison",
    "makeup",
    "man",
    "management",
    "mango",
    "map",
    "market",
    "marketing",
    "markets",
    "marriott",
    "marshalls",
    "maserati",
    "mattel",
    "mba",
    "mc",
    "mckinsey",
    "md",
    "me",
    "med",
    "media",
    "meet",
    "melbourne",
    "meme",
    "memorial",
    "men",
    "menu",
    "meo",
    "merckmsd",
    "metlife",
    "mg",
    "mh",
    "miami",
    "microsoft",
    "mil",
    "mini",
    "mint",
    "mit",
    "mitsubishi",
    "mk",
    "ml",
    "mlb",
    "mls",
    "mm",
    "mma",
    "mn",
    "mo",
    "mobi",
    "mobile",
    "mobily",
    "moda",
    "moe",
    "moi",
    "mom",
    "monash",
    "money",
    "monster",
    "mopar",
    "mormon",
    "mortgage",
    "moscow",
    "moto",
    "motorcycles",
    "mov",
    "movie",
    "movistar",
    "mp",
    "mq",
    "mr",
    "ms",
    "msd",
    "mt",
    "mtn",
    "mtr",
    "mu",
    "museum",
    "mutual",
    "mv",
    "mw",
    "mx",
    "my",
    "mz",
    "na",
    "nab",
    "nadex",
    "nagoya",
    "name",
    "nationwide",
    "natura",
    "navy",
    "nba",
    "nc",
    "ne",
    "nec",
    "net",
    "netbank",
    "netflix",
    "network",
    "neustar",
    "new",
    "newholland",
    "news",
    "next",
    "nextdirect",
    "nexus",
    "nf",
    "nfl",
    "ng",
    "ngo",
    "nhk",
    "ni",
    "nico",
    "nike",
    "nikon",
    "ninja",
    "nissan",
    "nissay",
    "nl",
    "no",
    "nokia",
    "northwesternmutual",
    "norton",
    "now",
    "nowruz",
    "nowtv",
    "np",
    "nr",
    "nra",
    "nrw",
    "ntt",
    "nu",
    "nyc",
    "nz",
    "obi",
    "observer",
    "off",
    "office",
    "okinawa",
    "olayan",
    "olayangroup",
    "oldnavy",
    "ollo",
    "om",
    "omega",
    "one",
    "ong",
    "onl",
    "online",
    "onyourside",
    "ooo",
    "open",
    "oracle",
    "orange",
    "org",
    "organic",
    "origins",
    "osaka",
    "otsuka",
    "ott",
    "ovh",
    "pa",
    "page",
    "panasonic",
    "panerai",
    "paris",
    "pars",
    "partners",
    "parts",
    "party",
    "passagens",
    "pay",
    "pccw",
    "pe",
    "pet",
    "pf",
    "pfizer",
    "pg",
    "ph",
    "pharmacy",
    "phd",
    "philips",
    "phone",
    "photo",
    "photography",
    "photos",
    "physio",
    "piaget",
    "pics",
    "pictet",
    "pictures",
    "pid",
    "pin",
    "ping",
    "pink",
    "pioneer",
    "pizza",
    "pk",
    "pl",
    "place",
    "play",
    "playstation",
    "plumbing",
    "plus",
    "pm",
    "pn",
    "pnc",
    "pohl",
    "poker",
    "politie",
    "porn",
    "post",
    "pr",
    "pramerica",
    "praxi",
    "press",
    "prime",
    "pro",
    "prod",
    "productions",
    "prof",
    "progressive",
    "promo",
    "properties",
    "property",
    "protection",
    "pru",
    "prudential",
    "ps",
    "pt",
    "pub",
    "pw",
    "pwc",
    "py",
    "qa",
    "qpon",
    "quebec",
    "quest",
    "qvc",
    "racing",
    "radio",
    "raid",
    "re",
    "read",
    "realestate",
    "realtor",
    "realty",
    "recipes",
    "red",
    "redstone",
    "redumbrella",
    "rehab",
    "reise",
    "reisen",
    "reit",
    "reliance",
    "ren",
    "rent",
    "rentals",
    "repair",
    "report",
    "republican",
    "rest",
    "restaurant",
    "review",
    "reviews",
    "rexroth",
    "rich",
    "richardli",
    "ricoh",
    "rightathome",
    "ril",
    "rio",
    "rip",
    "rmit",
    "ro",
    "rocher",
    "rocks",
    "rodeo",
    "rogers",
    "room",
    "rs",
    "rsvp",
    "ru",
    "rugby",
    "ruhr",
    "run",
    "rw",
    "rwe",
    "ryukyu",
    "sa",
    "saarland",
    "safe",
    "safety",
    "sakura",
    "sale",
    "salon",
    "samsclub",
    "samsung",
    "sandvik",
    "sandvikcoromant",
    "sanofi",
    "sap",
    "sapo",
    "sarl",
    "sas",
    "save",
    "saxo",
    "sb",
    "sbi",
    "sbs",
    "sc",
    "sca",
    "scb",
    "schaeffler",
    "schmidt",
    "scholarships",
    "school",
    "schule",
    "schwarz",
    "science",
    "scjohnson",
    "scor",
    "scot",
    "sd",
    "se",
    "search",
    "seat",
    "secure",
    "security",
    "seek",
    "select",
    "sener",
    "services",
    "ses",
    "seven",
    "sew",
    "sex",
    "sexy",
    "sfr",
    "sg",
    "sh",
    "shangrila",
    "sharp",
    "shaw",
    "shell",
    "shia",
    "shiksha",
    "shoes",
    "shop",
    "shopping",
    "shouji",
    "show",
    "showtime",
    "shriram",
    "si",
    "silk",
    "sina",
    "singles",
    "site",
    "sj",
    "sk",
    "ski",
    "skin",
    "sky",
    "skype",
    "sl",
    "sling",
    "sm",
    "smart",
    "smile",
    "sn",
    "sncf",
    "so",
    "soccer",
    "social",
    "softbank",
    "software",
    "sohu",
    "solar",
    "solutions",
    "song",
    "sony",
    "soy",
    "space",
    "spiegel",
    "sport",
    "spot",
    "spreadbetting",
    "sr",
    "srl",
    "srt",
    "st",
    "stada",
    "staples",
    "star",
    "starhub",
    "statebank",
    "statefarm",
    "statoil",
    "stc",
    "stcgroup",
    "stockholm",
    "storage",
    "store",
    "stream",
    "studio",
    "study",
    "style",
    "su",
    "sucks",
    "supplies",
    "supply",
    "support",
    "surf",
    "surgery",
    "suzuki",
    "sv",
    "swatch",
    "swiftcover",
    "swiss",
    "sx",
    "sy",
    "sydney",
    "symantec",
    "systems",
    "sz",
    "tab",
    "taipei",
    "talk",
    "taobao",
    "target",
    "tatamotors",
    "tatar",
    "tattoo",
    "tax",
    "taxi",
    "tc",
    "tci",
    "td",
    "tdk",
    "team",
    "tech",
    "technology",
    "tel",
    "telecity",
    "telefonica",
    "temasek",
    "tennis",
    "teva",
    "tf",
    "tg",
    "th",
    "thd",
    "theater",
    "theatre",
    "tiaa",
    "tickets",
    "tienda",
    "tiffany",
    "tips",
    "tires",
    "tirol",
    "tj",
    "tjmaxx",
    "tjx",
    "tk",
    "tkmaxx",
    "tl",
    "tm",
    "tmall",
    "tn",
    "to",
    "today",
    "tokyo",
    "tools",
    "top",
    "toray",
    "toshiba",
    "total",
    "tours",
    "town",
    "toyota",
    "toys",
    "tr",
    "trade",
    "trading",
    "training",
    "travel",
    "travelchannel",
    "travelers",
    "travelersinsurance",
    "trust",
    "trv",
    "tt",
    "tube",
    "tui",
    "tunes",
    "tushu",
    "tv",
    "tvs",
    "tw",
    "tz",
    "ua",
    "ubank",
    "ubs",
    "uconnect",
    "ug",
    "uk",
    "unicom",
    "university",
    "uno",
    "uol",
    "ups",
    "us",
    "uy",
    "uz",
    "va",
    "vacations",
    "vana",
    "vanguard",
    "vc",
    "ve",
    "vegas",
    "ventures",
    "verisign",
    "versicherung",
    "vet",
    "vg",
    "vi",
    "viajes",
    "video",
    "vig",
    "viking",
    "villas",
    "vin",
    "vip",
    "virgin",
    "visa",
    "vision",
    "vista",
    "vistaprint",
    "viva",
    "vivo",
    "vlaanderen",
    "vn",
    "vodka",
    "volkswagen",
    "volvo",
    "vote",
    "voting",
    "voto",
    "voyage",
    "vu",
    "vuelos",
    "wales",
    "walmart",
    "walter",
    "wang",
    "wanggou",
    "warman",
    "watch",
    "watches",
    "weather",
    "weatherchannel",
    "webcam",
    "weber",
    "website",
    "wed",
    "wedding",
    "weibo",
    "weir",
    "wf",
    "whoswho",
    "wien",
    "wiki",
    "williamhill",
    "win",
    "windows",
    "wine",
    "winners",
    "wme",
    "wolterskluwer",
    "woodside",
    "work",
    "works",
    "world",
    "wow",
    "ws",
    "wtc",
    "wtf",
    "xbox",
    "xerox",
    "xfinity",
    "xihuan",
    "xin",
    "कॉम", // xn--11b4c3d
    "セール", // xn--1ck2e1b
    "佛山", // xn--1qqw23a
    "ಭಾರತ", // xn--2scrj9c
    "慈善", // xn--30rr7y
    "集团", // xn--3bst00m
    "在线", // xn--3ds443g
    "한국", // xn--3e0b707e
    "ଭାରତ", // xn--3hcrj9c
    "大众汽车", // xn--3oq18vl8pn36a
    "点看", // xn--3pxu8k
    "คอม", // xn--42c2d9a
    "ভাৰত", // xn--45br5cyl
    "ভারত", // xn--45brj9c
    "八卦", // xn--45q11c
    "موقع", // xn--4gbrim
    "বাংলা", // xn--54b7fta0cc
    "公益", // xn--55qw42g
    "公司", // xn--55qx5d
    "香格里拉", // xn--5su34j936bgsg
    "网站", // xn--5tzm5g
    "移动", // xn--6frz82g
    "我爱你", // xn--6qq986b3xl
    "москва", // xn--80adxhks
    "қаз", // xn--80ao21a
    "католик", // xn--80aqecdr1a
    "онлайн", // xn--80asehdb
    "сайт", // xn--80aswg
    "联通", // xn--8y0a063a
    "срб", // xn--90a3ac
    "бг", // xn--90ae
    "бел", // xn--90ais
    "קום", // xn--9dbq2a
    "时尚", // xn--9et52u
    "微博", // xn--9krt00a
    "淡马锡", // xn--b4w605ferd
    "ファッション", // xn--bck1b9a5dre4c
    "орг", // xn--c1avg
    "नेट", // xn--c2br7g
    "ストア", // xn--cck2b3b
    "삼성", // xn--cg4bki
    "சிங்கப்பூர்", // xn--clchc0ea0b2g2a9gcd
    "商标", // xn--czr694b
    "商店", // xn--czrs0t
    "商城", // xn--czru2d
    "дети", // xn--d1acj3b
    "мкд", // xn--d1alf
    "ею", // xn--e1a4c
    "ポイント", // xn--eckvdtc9d
    "新闻", // xn--efvy88h
    "工行", // xn--estv75g
    "家電", // xn--fct429k
    "كوم", // xn--fhbei
    "中文网", // xn--fiq228c5hs
    "中信", // xn--fiq64b
    "中国", // xn--fiqs8s
    "中國", // xn--fiqz9s
    "娱乐", // xn--fjq720a
    "谷歌", // xn--flw351e
    "భారత్", // xn--fpcrj9c3d
    "ලංකා", // xn--fzc2c9e2c
    "電訊盈科", // xn--fzys8d69uvgm
    "购物", // xn--g2xx48c
    "クラウド", // xn--gckr3f0f
    "ભારત", // xn--gecrj9c
    "通販", // xn--gk3at1e
    "भारतम्", // xn--h2breg3eve
    "भारत", // xn--h2brj9c
    "भारोत", // xn--h2brj9c8c
    "网店", // xn--hxt814e
    "संगठन", // xn--i1b6b1a6a2e
    "餐厅", // xn--imr513n
    "网络", // xn--io0a7i
    "ком", // xn--j1aef
    "укр", // xn--j1amh
    "香港", // xn--j6w193g
    "诺基亚", // xn--jlq61u9w7b
    "食品", // xn--jvr189m
    "飞利浦", // xn--kcrx77d1x4a
    "台湾", // xn--kprw13d
    "台灣", // xn--kpry57d
    "手表", // xn--kpu716f
    "手机", // xn--kput3i
    "мон", // xn--l1acc
    "الجزائر", // xn--lgbbat1ad8j
    "عمان", // xn--mgb9awbf
    "ارامكو", // xn--mgba3a3ejt
    "ایران", // xn--mgba3a4f16a
    "العليان", // xn--mgba7c0bbn0a
    "اتصالات", // xn--mgbaakc7dvf
    "امارات", // xn--mgbaam7a8h
    "بازار", // xn--mgbab2bd
    "پاکستان", // xn--mgbai9azgqp6j
    "الاردن", // xn--mgbayh7gpa
    "موبايلي", // xn--mgbb9fbpob
    "بارت", // xn--mgbbh1a
    "بھارت", // xn--mgbbh1a71e
    "المغرب", // xn--mgbc0a9azcg
    "ابوظبي", // xn--mgbca7dzdo
    "السعودية", // xn--mgberp4a5d4ar
    "ڀارت", // xn--mgbgu82a
    "كاثوليك", // xn--mgbi4ecexp
    "سودان", // xn--mgbpl2fh
    "همراه", // xn--mgbt3dhd
    "عراق", // xn--mgbtx2b
    "مليسيا", // xn--mgbx4cd0ab
    "澳門", // xn--mix891f
    "닷컴", // xn--mk1bu44c
    "政府", // xn--mxtq1m
    "شبكة", // xn--ngbc5azd
    "بيتك", // xn--ngbe9e0a
    "عرب", // xn--ngbrx
    "გე", // xn--node
    "机构", // xn--nqv7f
    "组织机构", // xn--nqv7fs00ema
    "健康", // xn--nyqy26a
    "ไทย", // xn--o3cw4h
    "سورية", // xn--ogbpf8fl
    "招聘", // xn--otu796d
    "рус", // xn--p1acf
    "рф", // xn--p1ai
    "珠宝", // xn--pbt977c
    "تونس", // xn--pgbs0dh
    "大拿", // xn--pssy2u
    "みんな", // xn--q9jyb4c
    "グーグル", // xn--qcka1pmc
    "ελ", // xn--qxam
    "世界", // xn--rhqv96g
    "書籍", // xn--rovu88b
    "ഭാരതം", // xn--rvc1e0am3e
    "ਭਾਰਤ", // xn--s9brj9c
    "网址", // xn--ses554g
    "닷넷", // xn--t60b56a
    "コム", // xn--tckwe
    "天主教", // xn--tiq49xqyj
    "游戏", // xn--unup4y
    "vermögensberater", // xn--vermgensberater-ctb
    "vermögensberatung", // xn--vermgensberatung-pwb
    "企业", // xn--vhquv
    "信息", // xn--vuq861b
    "嘉里大酒店", // xn--w4r85el8fhu5dnra
    "嘉里", // xn--w4rs40l
    "مصر", // xn--wgbh1c
    "قطر", // xn--wgbl6a
    "广东", // xn--xhq521b
    "இலங்கை", // xn--xkc2al3hye2a
    "இந்தியா", // xn--xkc2dl3a5ee0h
    "հայ", // xn--y9a3aq
    "新加坡", // xn--yfro4i67o
    "فلسطين", // xn--ygbi2ammx
    "政务", // xn--zfr164b
    "xperia",
    "xxx",
    "xyz",
    "yachts",
    "yahoo",
    "yamaxun",
    "yandex",
    "ye",
    "yodobashi",
    "yoga",
    "yokohama",
    "you",
    "youtube",
    "yt",
    "yun",
    "za",
    "zappos",
    "zara",
    "zero",
    "zip",
    "zippo",
    "zm",
    "zone",
    "zuerich",
    "zw"
  ];

  var urlRegex = options => {
  	options = {
  		strict: true,
  		...options
  	};

  	const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;
  	const auth = '(?:\\S+(?::\\S*)?@)?';
  	const ip = ipRegex.v4().source;
  	const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
  	const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
  	const tld = `(?:\\.${options.strict ? '(?:[a-z\\u00a1-\\uffff]{2,})' : `(?:${tlds.sort((a, b) => b.length - a.length).join('|')})`})\\.?`;
  	const port = '(?::\\d{2,5})?';
  	const path = '(?:[/?#][^\\s"]*)?';
  	const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`;

  	return options.exact ? new RegExp(`(?:^${regex}$)`, 'i') : new RegExp(regex, 'ig');
  };

  const urlRegex$1 = urlRegex({ exact: true });

  var fromByteArray_1 = fromByteArray;

  var lookup = [];
  var revLookup = [];

  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;

  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] +
      lookup[num >> 12 & 0x3F] +
      lookup[num >> 6 & 0x3F] +
      lookup[num & 0x3F]
  }

  function encodeChunk (uint8, start, end) {
    var tmp;
    var output = [];
    for (var i = start; i < end; i += 3) {
      tmp =
        ((uint8[i] << 16) & 0xFF0000) +
        ((uint8[i + 1] << 8) & 0xFF00) +
        (uint8[i + 2] & 0xFF);
      output.push(tripletToBase64(tmp));
    }
    return output.join('')
  }

  function fromByteArray (uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(
        uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
      ));
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(
        lookup[tmp >> 2] +
        lookup[(tmp << 4) & 0x3F] +
        '=='
      );
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(
        lookup[tmp >> 10] +
        lookup[(tmp >> 4) & 0x3F] +
        lookup[(tmp << 2) & 0x3F] +
        '='
      );
    }

    return parts.join('')
  }

  // Copyright Joyent, Inc. and other Node contributors.

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  function dirname(path) {
    var result = splitPath(path),
        root = result[0],
        dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }

    return root + dir;
  }

  /* global self */
  const {
    promises: promises$1
  } = fs; // FIX Convert data by representation.

  const writeFile = async (options, path, data) => {
    data = await data;

    if (isWebWorker) {
      return self.ask({
        writeFile: {
          options: { ...options,
            as: 'bytes'
          },
          path,
          data: await data
        }
      });
    }

    const {
      as = 'utf8',
      ephemeral,
      project = getFilesystem()
    } = options;
    let originalProject = getFilesystem();

    if (project !== originalProject) {
      log({
        op: 'text',
        text: `Write ${path} of ${project}`
      }); // Switch to the source filesystem, if necessary.

      setupFilesystem({
        fileBase: project
      });
    }

    if (typeof data === 'string') {
      data = new TextEncoder(as).encode(data);
    }

    await log({
      op: 'text',
      text: `Write ${path}`
    });
    const file = await getFile(options, path);
    file.data = data;

    for (const watcher of file.watchers) {
      await watcher(options, file);
    }

    const base = getBase();

    if (!ephemeral && base !== undefined) {
      const persistentPath = `jsxcad/${base}${path}`;

      if (isNode) {
        try {
          await promises$1.mkdir(dirname(persistentPath), {
            recursive: true
          });
        } catch (error) {}

        try {
          await promises$1.writeFile(persistentPath, data);
        } catch (error) {
          console.log(`QQ/writeFile/error: ${error.toString()}`);
        }
      } else if (isBrowser) {
        await localforage.setItem(persistentPath, fromByteArray_1(data));
      }
    }

    if (project !== originalProject) {
      // Switch back to the original filesystem, if necessary.
      setupFilesystem({
        fileBase: originalProject
      });
    }
  };

  /* global postMessage, onmessage:writable, self */
  Error.stackTraceLimit = Infinity;

  window.bootstrap = async () => {
    const {
      search
    } = location; // We expect something like: '?github=xxx'

    if (search.startsWith('?github=')) {
      const accessToken = search.substring(8);
      await writeFile({
        project: '.system'
      }, 'auth/github/accessToken', accessToken);
    }

    window.close();
  };

  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      window.bootstrap();
    }
  };

});
