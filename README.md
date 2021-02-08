# Vue Plugin Use Store

## Installation

```bash
yarn add @apenhet/vue-plugin-use-store
```

## Initialize

This package works both with Vue 2 + Composition API and Vue 3 + (Vuex).
To start using your store modules, simply register your store as follows:

### Vue 3
```ts
// store/index.ts

import { registerStore } from '@apenhet/vue-plugin-use-store'
import { createStore } from 'vuex'

export const modules = {}

const store = createStore({
  modules,
})

registerStore(store)

export default store
```


### Vue 2
```ts
// store/index.ts

import { registerStore } from '@apenhet/vue-plugin-use-store'
import Vuex from 'vuex'

export const modules = {}

const store = new Vuex.Store({
  modules,
})

registerStore(store)

export default store
```

```ts
// main.ts

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)
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
