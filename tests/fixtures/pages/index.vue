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

        <button class="change-path" @click="handleClickChangePath">Change Path</button>
        <button class="change-path-without-param" @click="handleClickChangePathWithoutParam">Change Path Without Param</button>
        <button class="create-user" @click="handleCreateUser">Create User</button>
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
    asyncData: async ({ app, route }) => {
        if (route.query.nuxtError) {
            return await app.$api.nuxtError.error();
        }

        await app.$api.users.createAction({ body: { first_name: 'first', last_name: 'user' } });
        const { users } = await app.$api.users.allAction();

        let errorMessage;
        try {
            await app.$api.products.allAction({ query: { force_error: 'true' } });
        } catch (err) {
            errorMessage = err.message;
        }

        return {
            users,
            errorMessage,
            data: await app.$api.users.categories.types.allAction()
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
        }
    }
};
</script>
