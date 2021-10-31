import '@nuxt/types';
import 'vuex';
import { Api } from 'nuxt-neo';
import { ModuleConfiguration } from './configuration';

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        readonly $api: Api;
    }

    interface Context {
        readonly $api: Api;
    }

    interface NuxtConfig {
        nuxtNeo?: ModuleConfiguration;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        readonly $api: Api;
    }
}

declare module 'vuex/types/index' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        readonly $api: Api;
    }
}
