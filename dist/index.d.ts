import "core-js/stable";
import "regenerator-runtime/runtime";
import { ComputedRef, Ref } from 'vue-demi';
declare type StorePath = typeof import('@store');
declare type BaseStore = StorePath['default'];
declare type Modules = StorePath['modules'];
declare type ModuleNames = Extract<keyof Modules, string>;
declare type ModuleActions<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], {
    actions: any;
}>['actions'];
declare type ModuleActionNames<ModuleName extends ModuleNames> = Extract<keyof ModuleActions<ModuleName>, string>;
declare type ModuleAction<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Extract<ModuleActions<ModuleName>[ActionName], (...args: any) => any>;
declare type ModuleActionPayload<ModuleName extends ModuleNames, ActionName extends ModuleActionNames<ModuleName>> = Parameters<ModuleAction<ModuleName, ActionName>>[1] extends undefined ? () => ReturnType<ModuleAction<ModuleName, ActionName>> : (payload: Parameters<ModuleAction<ModuleName, ActionName>>[1]) => ReturnType<ModuleAction<ModuleName, ActionName>>;
declare type ModuleActionsTree<ModuleName extends ModuleNames> = {
    [K in ModuleActionNames<ModuleName>]: ModuleActionPayload<ModuleName, K>;
};
declare type ModuleGetters<ModuleName extends ModuleNames> = Extract<Modules[ModuleName], {
    getters: any;
}>['getters'];
declare type ModuleGetterNames<ModuleName extends ModuleNames> = Extract<keyof ModuleGetters<ModuleName>, string>;
declare type ModuleGetter<ModuleName extends ModuleNames, GetterName extends ModuleGetterNames<ModuleName>> = Extract<ModuleGetters<ModuleName>[GetterName], (...args: any) => any>;
declare type ModuleGettersTree<ModuleName extends ModuleNames> = {
    [K in ModuleGetterNames<ModuleName>]: ComputedRef<ReturnType<ModuleGetter<ModuleName, K>>>;
};
declare type ModuleState<ModuleName extends ModuleNames> = Modules[ModuleName]['state'] extends () => any ? ReturnType<Modules[ModuleName]['state']> : Modules[ModuleName]['state'];
declare type ModuleStateTree<ModuleName extends ModuleNames> = {
    [K in keyof ModuleState<ModuleName>]: Ref<ModuleState<ModuleName>[K]>;
};
export declare function registerStore<CurrentStore extends BaseStore>(store: CurrentStore): CurrentStore;
export declare function useModuleStore<ModuleName extends ModuleNames>(name: ModuleName): ModuleActionsTree<ModuleName> & ModuleGettersTree<ModuleName> & ModuleStateTree<ModuleName>;
export {};
//# sourceMappingURL=index.d.ts.map