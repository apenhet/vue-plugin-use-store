import { toRefs, computed } from 'vue-demi';

const options = {
  registeredStore: null
};
function registerStore(store) {
  Object.defineProperty(options, 'registeredStore', {
    value: store
  });
  return store;
}
function useModuleStore(name) {
  const store = options.registeredStore;

  if (!store) {
    throw new Error(`No store was registered.`);
  }

  if (store?.hasModule(name)) {
    return { ...storeModuleState(store, name),
      ...storeModuleGetters(store, name),
      ...storeModuleActions(store, name)
    };
  }

  throw new Error(`The module ${name} does not exist`);
}
/**
 * Return the sore module state.
 * 
 * @param name 
 */

function storeModuleState(store, name) {
  const rootState = store.state;
  return toRefs(rootState[name]);
}
/**
 * Return the sore module getters.
 * 
 * @param name 
 */


function storeModuleGetters(store, name) {
  const {
    getters,
    namespaced
  } = getRawModule(store, name);
  const tree = {};

  for (const key in getters) {
    const treeKey = key;
    const getterName = namespaced ? `${name}/${key}` : key;
    tree[treeKey] = computed(() => store.getters[getterName]);
  }

  return tree;
}
/**
 * Return the sore module actions.
 * 
 * @param name 
 */


function storeModuleActions(store, name) {
  const {
    actions,
    namespaced
  } = getRawModule(store, name);
  const tree = {};

  for (const key in actions) {
    const treeKey = key;
    const actionName = namespaced ? `${name}/${key}` : key;

    const method = async payload => {
      return await store.dispatch(actionName, payload);
    };

    tree[treeKey] = method;
  }

  return tree;
}

function getRawModule(store, name) {
  const root = store._modules.root;
  return root._rawModule.modules[name];
}

export { registerStore, useModuleStore };
