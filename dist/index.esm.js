import { toRefs, computed } from 'vue-demi';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var options = {
  registeredStore: null
};
function registerStore(store) {
  Object.defineProperty(options, 'registeredStore', {
    value: store
  });
  return store;
}
function useModuleStore(name) {
  var store = options.registeredStore;

  if (!store) {
    throw new Error("No store was registered.");
  }

  if (store !== null && store !== void 0 && store.hasModule(name)) {
    return _objectSpread2(_objectSpread2(_objectSpread2({}, storeModuleState(store, name)), storeModuleGetters(store, name)), storeModuleActions(store, name));
  }

  throw new Error("The module ".concat(name, " does not exist"));
}
/**
 * Return the sore module state.
 * 
 * @param name 
 */

function storeModuleState(store, name) {
  var rootState = store.state;
  return toRefs(rootState[name]);
}
/**
 * Return the sore module getters.
 * 
 * @param name 
 */


function storeModuleGetters(store, name) {
  var _getRawModule = getRawModule(store, name),
      getters = _getRawModule.getters,
      namespaced = _getRawModule.namespaced;

  var tree = {};

  var _loop = function _loop(key) {
    var treeKey = key;
    var getterName = namespaced ? "".concat(name, "/").concat(key) : key;
    tree[treeKey] = computed(function () {
      return store.getters[getterName];
    });
  };

  for (var key in getters) {
    _loop(key);
  }

  return tree;
}
/**
 * Return the sore module actions.
 * 
 * @param name 
 */


function storeModuleActions(store, name) {
  var _getRawModule2 = getRawModule(store, name),
      actions = _getRawModule2.actions,
      namespaced = _getRawModule2.namespaced;

  var tree = {};

  var _loop2 = function _loop2(key) {
    var treeKey = key;
    var actionName = namespaced ? "".concat(name, "/").concat(key) : key;

    var method = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(payload) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return store.dispatch(actionName, payload);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function method(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    tree[treeKey] = method;
  };

  for (var key in actions) {
    _loop2(key);
  }

  return tree;
}

function getRawModule(store, name) {
  var root = store._modules.root;
  return root._rawModule.modules[name];
}

export { registerStore, useModuleStore };
