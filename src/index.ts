import "core-js/stable";
import "regenerator-runtime/runtime";

import { ComputedRef, Ref, computed, toRefs } from 'vue-demi'

import { Module } from 'vuex'

type StorePath = typeof import('@store')
type BaseStore = StorePath['default']
type Modules = StorePath['modules']
type RootState = BaseStore['state'] & { [K in ModuleNames]: Modules[K] }
type ModuleNames = Extract<keyof Modules, string>

type ModuleActions<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], { actions: any }>['actions']
type ModuleActionNames<ModuleName extends ModuleNames> = Extract<keyof ModuleActions<ModuleName>, string>
type ModuleAction<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Extract<ModuleActions<ModuleName>[ActionName], (...args: any) => any>
type ModuleActionPayload<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Parameters<ModuleAction<ModuleName, ActionName>>[1] extends undefined ?
    () => ReturnType<ModuleAction<ModuleName, ActionName>> :
    (payload: Parameters<ModuleAction<ModuleName, ActionName>>[1]) => ReturnType<ModuleAction<ModuleName, ActionName>>
type ModuleActionsTree<ModuleName extends ModuleNames> = { [K in ModuleActionNames<ModuleName>]: ModuleActionPayload<ModuleName, K> }

type ModuleGetters<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], { getters: any }>['getters']
type ModuleGetterNames<ModuleName extends ModuleNames> = Extract<keyof ModuleGetters<ModuleName>, string>
type ModuleGetter<ModuleName extends ModuleNames, GetterName extends ModuleGetterNames<ModuleName>> = Extract<ModuleGetters<ModuleName>[GetterName], (...args: any) => any>
type ModuleGettersTree<ModuleName extends ModuleNames> = { [K in ModuleGetterNames<ModuleName>]: ComputedRef<ReturnType<ModuleGetter<ModuleName, K>>> }

type ModuleState<ModuleName extends ModuleNames> = Modules[ModuleName]['state'] extends () => any ? ReturnType<Modules[ModuleName]['state']> : Modules[ModuleName]['state']
type ModuleStateTree<ModuleName extends ModuleNames> = { [K in keyof ModuleState<ModuleName>]: Ref<ModuleState<ModuleName>[K]> }

const options = {
    registeredStore: null as null | BaseStore,
    cachedModules: {} as any
}

export function registerStore<CurrentStore extends BaseStore>(store: CurrentStore) {
    Object.defineProperty(options, 'registeredStore', { value: store })

    return store
}

export function useModuleStore<ModuleName extends ModuleNames>(name: ModuleName): ModuleActionsTree<ModuleName> & ModuleGettersTree<ModuleName> & ModuleStateTree<ModuleName>
export function useModuleStore<ModuleName extends ModuleNames>(name: ModuleName) {
    const store = options.registeredStore

    if (!store) {
        throw new Error(`No store was registered.`)
    }

    if (store?.hasModule(name)) {
        return options.cachedModules[name] || (options.cachedModules[name] = {
            ...storeModuleState(store, name),
            ...storeModuleGetters(store, name),
            ...storeModuleActions(store, name)
        })
    }

    throw new Error(`The module ${name} does not exist`)
}


/**
 * Return the sore module state.
 * 
 * @param name 
 */
function storeModuleState<ModuleName extends ModuleNames>(store: BaseStore, name: ModuleName) {
    const rootState = store.state as RootState
    return toRefs(rootState[name])
}


/**
 * Return the sore module getters.
 * 
 * @param name 
 */
function storeModuleGetters<ModuleName extends ModuleNames>(store: BaseStore, name: ModuleName) {
    const { getters, namespaced } = getRawModule(store, name)
    const tree = {} as ModuleGettersTree<ModuleName>

    for (const key in getters) {
        const treeKey = key as ModuleGetterNames<ModuleName>
        const getterName = namespaced ? `${name}/${key}` : key
        tree[treeKey] = computed(() => store.getters[getterName])
    }

    return tree
}


/**
 * Return the sore module actions.
 * 
 * @param name 
 */
function storeModuleActions<ModuleName extends ModuleNames>(store: BaseStore, name: ModuleName) {
    const { actions, namespaced } = getRawModule(store, name)
    const tree = {} as ModuleActionsTree<ModuleName>

    for (const key in actions) {
        const treeKey = key as ModuleActionNames<ModuleName>
        const actionName = namespaced ? `${name}/${key}` : key
        const method: any = async (payload?: unknown) => {
            return await store.dispatch(actionName, payload)
        }
        tree[treeKey] = method
    }

    return tree
}

function getRawModule<ModuleName extends ModuleNames>(store: BaseStore, name: ModuleName) {
    const root = (store as any)._modules.root

    return root._rawModule.modules[name] as Module<any, any>
}