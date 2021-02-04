import { ComputedRef, Ref } from 'vue-demi';
declare type StorePath = typeof import('@store');
declare type Store = StorePath['default'];
declare type Modules = StorePath['modules'];
declare type ModuleNames = Extract<keyof Modules, string>;
export declare function registerStore(store: Store): any;
export declare function useModuleStore<ModuleName extends ModuleNames>(name: ModuleName): {
    [x: string]: Ref<any> | ComputedRef<any> | ((payload: unknown) => any);
};
export {};
//# sourceMappingURL=index.d.ts.map