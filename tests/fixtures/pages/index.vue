<template>
    <div class="index">
        <span class="path">{{ data.path }}</span>
        <span class="id-param">{{ data.params && data.params.id }}</span>
        <span v-if="data.ok" class="okay">It's okay!</span>
        <span v-else class="okay">It's not okay...</span>
        <span v-if="data.success_handler" class="response-middleware">It's okay!</span>
        <span v-else class="response-middleware">It's not okay...</span>
        <span class="number-of-users">{{ users.length }}</span>
        <span v-if="users && users[0]" class="first-user">{{ users[0].first_name }}</span>
        <span v-if="serverForceError" class="server-side-force-error">{{ serverForceError }}</span>

        <button class="change-path" @click="handleClick">Change Path</button>
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

        let serverForceError;
        try {
            await app.$api.products.allAction({ query: { force_error: 'true' } });
        } catch (err) {
            serverForceError = err.message;
        }

        return {
            users,
            serverForceError,
            data: await app.$api.users.categories.types.allAction()
        };
    },
    methods: {
        async handleClick() {
            this.data = await this.$api.users.getAction({ params: { id: 1 } });
        },
        async handleCreateUser() {
            await this.$api.users.createAction({
                body: {
                    first_name: 'nuxt',
                    last_name: 'neo'
                }
            });
            const { users } = await this.$api.users.allAction();
            this.users = users;
        }
    }
};
</script>
