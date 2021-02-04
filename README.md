# Vue Plugin Use Store

## Installation

```bash
yarn add @apenhet/vue-plugin-use-store
```

## Initialize

This package works both with Vue 2 + Composition API and Vue 3 + (Vuex).
To start using your store modules, simply register your store as follows:

```ts
import { registerStore } from '@apenhet/vue-plugin-use-store'
import { createStore } from 'vuex'

const store = createStore({
  modules,
})

registerStore(store)

// Export your modules
export const modules = {}

// Default export your store
export default store
```

## TypeScript

The true benefits of this package appear when you use TypeScript. After registering your store as previously explained, simply add this line to your `tsconfig.json` (or you `jsconfig.json`).

```json
{
  "compilerOptions": {
    "paths": {
      "@store": ["path/to/your/store.ts"]
    },
}
```

## Usage

You can now use your store modules as follows:

```typescript
// store/some-module-name.ts

const state = () => ({ someStateProperty: false })

const mutations = {
  SOMETHING(state: State, payload: number) {
    state.someStateProperty = payload > 10
  },
}

const actions = {
  async someAction(
    { commit }: ActionContext<State, RootState>,
    payload: number
  ) {
    commit('SOMETHING', payload)
  },
  async someActionWitoutParams({ commit }: ActionContext<State, RootState>) {
    return 'DONE'
  },
}

const getters = {
  someGetter(state: State) {
    return 'SOMETHING_ELSE'
  },
}

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
}
```

```vue
// App.vue

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useModuleStore } from '@apenhet/vue-plugin-use-store'

export default defineComponent({
  setup() {
    const {
      someStateProperty,
      someAction,
      someActionWithoutParams,
      someGetter,
    } = useModuleStore('some-module-name')

    return {
      someStateProperty, // Ref<boolean>
      someAction, // (payload: number) => Promise<void>
      someActionWithoutParams, // () => Promise<string>
      someGetter, // ComputedRef<string>
    }
  },
})
</script>
```
