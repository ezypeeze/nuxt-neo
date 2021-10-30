import '@nuxt/types';
import 'vuex';
import { Api } from './api';
import { ModuleConfiguration } from './configuration';

declare module 'vue/types/vue' {
    interface Vue {
        readonly $api: Api;
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        readonly $api: Api;
    }

    interface Context {
        readonly $api: Api;
    }

    interface Configuration {
        nuxtNeo: ModuleConfiguration;
    }
}

declare module 'vuex/types/index' {
    interface Store<S> {
        readonly $api: Api;
    }
}
