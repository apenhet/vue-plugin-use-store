import { ComputedRef, Ref, computed, toRefs } from 'vue-demi'

import { Module } from 'vuex'

// @ts-ignore
type StorePath = typeof import('@store')

type Store = StorePath['default']
type Modules = StorePath['modules']
type RootState = Store['state'] & { [K in ModuleNames]: Modules[K] }
type ModuleNames = Extract<keyof Modules, string>

type ModuleState<ModuleName extends ModuleNames> = Modules[ModuleName]['state'] extends () => any ? ReturnType<Modules[ModuleName]['state']> : Modules[ModuleName]['state']
type ModuleActions<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], { actions: any }>['actions']
type ModuleActionNames<ModuleName extends ModuleNames> = Extract<keyof ModuleActions<ModuleName>, string>
type ModuleAction<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Extract<ModuleActions<ModuleName>[ActionName], (...args: any) => any>
type ModuleActionPayload<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Parameters<ModuleAction<ModuleName, ActionName>>[1] extends undefined ?
    () => ReturnType<ModuleAction<ModuleName, ActionName>> :
    (payload: Parameters<ModuleAction<ModuleName, ActionName>>[1]) => ReturnType<ModuleAction<ModuleName, ActionName>>
type ModuleActionsTree<ModuleName extends ModuleNames> = { [K in ModuleActionNames<ModuleName>]: ModuleActionPayload<ModuleName, K> }
type ModuleGetters<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], { getters: any }>['getters']
type ModuleGetterNames<ModuleName extends ModuleNames> = Extract<keyof ModuleGetters<ModuleName>, string>
type ModuleGetter<ModuleName extends ModuleNames, GetterName extends ModuleGetterNames<ModuleName>> = ModuleGetters<ModuleName>[GetterName]
type ModuleGettersTree<ModuleName extends ModuleNames> = { [K in ModuleGetterNames<ModuleName>]: ComputedRef<ReturnType<ModuleGetter<ModuleName, K>>> }

const options = {
    registeredStore: null as null | Store
}

export function registerStore(store: Store) {
    Object.defineProperty(options, 'registeredStore', { value: store })

    return store
}

export function useModuleStore<ModuleName extends ModuleNames>(name: ModuleName) {
    const store = options.registeredStore
    if (!store) {
        throw new Error(`No store was registered.`)
    }

    if (store?.hasModule(name)) {
        return {
            ...storeModuleState(store, name),
            ...storeModuleGetters(store, name),
            ...storeModuleActions(store, name)
        }
    }

    throw new Error(`The module ${name} does not exist`)
}


/**
 * Return the sore module state.
 * 
 * @param name 
 */
function storeModuleState<ModuleName extends ModuleNames>(store: Store, name: ModuleName) {
    const rootState = store.state as RootState
    return toRefs(rootState[name] as ModuleState<ModuleName>) as { [K in ModuleState<ModuleName>]: Ref<ModuleState<ModuleName>[K]> }
}


/**
 * Return the sore module getters.
 * 
 * @param name 
 */
function storeModuleGetters<ModuleName extends ModuleNames>(store: Store, name: ModuleName) {
    const { getters, namespaced } = getRawModule(store, name)
    const tree = {} as ModuleGettersTree<ModuleName>

    for (const key in getters) {
        const treeKey = key as ModuleActionNames<ModuleName>
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
function storeModuleActions<ModuleName extends ModuleNames>(store: Store, name: ModuleName) {
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

function getRawModule<ModuleName extends ModuleNames>(store: Store, name: ModuleName) {
    const root = (store as any)._modules.root

    return root._rawModule.modules[name] as Module<any, any>
}