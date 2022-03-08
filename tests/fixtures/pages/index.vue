<template>
    <div class="index">
        <div class="path">{{ data.path }}</div>
        <div class="id-param">{{ data.params && data.params.id }}</div>
        <div v-if="data.ok" class="okay">It's okay!</div>
        <div v-else class="okay">It's not okay...</div>
        <div v-if="data.success_handler" class="response-middleware">It's okay!</div>
        <div v-else class="response-middleware">It's not okay...</div>
        <div class="number-of-users">{{ users.length }}</div>
        <div v-if="users && users[0]" class="first-user">{{ users[0].first_name }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="errorMessageGetOptional" class="error-message-get-optional">{{ errorMessageGetOptional }}</div>
        <div v-if="errorMessageGetWithoutParam" class="error-message-get-without-param">{{ errorMessageGetWithoutParam }}</div>

        <button class="change-path" @click="handleClickChangePath">Change Path</button>
        <button class="change-path-without-param" @click="handleClickChangePathWithoutParam">Change Path Without Param</button>
        <button class="create-user" @click="handleCreateUser">Create User</button>
        <button class="get-optional" @click="handleGetOptional">Get Optional</button>
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
    async asyncData({ $api, route }) {
        if (route.query.nuxtError) {
            return await $api.nuxtError.error();
        }

        await $api.users.createAction({ body: { first_name: 'first', last_name: 'user' } });
        const { users } = await $api.users.allAction();

        let errorMessage;
        try {
            await $api.products.allAction({ query: { force_error: 'true' } });
        } catch (err) {
            errorMessage = err.message;
        }

        let errorMessageGetOptional;
        try {
            await $api.users.getActionOptional({ params: { id: '1' } });
        } catch (error) {
            errorMessageGetOptional = error.message;
        }

        let errorMessageGetWithoutParam;
        try {
            await $api.users.getAction();
        } catch (error) {
            errorMessageGetWithoutParam = error.message;
        }

        return {
            users,
            errorMessage,
            errorMessageGetOptional,
            errorMessageGetWithoutParam,
            data: await $api.users.categories.types.allAction()
        };
    },
    methods: {
        async handleClickChangePath() {
            this.errorMessage = undefined;
            try {
                this.data = await this.$api.users.getAction({ params: { id: 1 } });
            } catch (err) {
                this.errorMessage = err.message;
            }
        },
        async handleClickChangePathWithoutParam() {
            this.errorMessage = undefined;
            try {
                this.data = await this.$api.users.getAction();
            } catch (err) {
                this.errorMessage = err.message;
            }
        },
        async handleCreateUser() {
            this.errorMessage = undefined;
            try {
                await this.$api.users.createAction({
                    body: {
                        first_name: 'nuxt',
                        last_name: 'neo'
                    }
                });
                const { users } = await this.$api.users.allAction();
                this.users = users;
            } catch (err) {
                this.errorMessage = err.message;
            }
        },
        async handleGetOptional() {
            this.errorMessage = undefined;
            try {
                this.data = await this.$api.users.getActionOptional({ params: { id: '1' } });
            } catch (err) {
                this.errorMessage = err.message;
            }
        }
    }
};
</script>
