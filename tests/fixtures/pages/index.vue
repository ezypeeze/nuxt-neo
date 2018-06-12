<template>
    <div class="index">
        <span class="path">{{ data.path }}</span>
        <span class="id-param">{{ data.params && data.params.id }}</span>
        <span class="okay" v-if="data.ok">It's okay!</span>
        <span class="okay" v-else>It's not okay...</span>
        <span class="response-middleware" v-if="data.response_middleware">It's okay!</span>
        <span class="response-middleware" v-else>It's not okay...</span>
        <span class="number-of-users">{{ users.length }}</span>
        <span class="first-user" v-if="users && users[0]">{{ users[0].first_name }}</span>
        <span class="server-side-force-error" v-if="serverForceError">{{ serverForceError }}</span>

        <button class="change-path" @click="handleClick">Change Path</button>
        <button class="create-user" @click="handleCreateUser">Create User</button>
    </div>
</template>

<script>
    export default {
        name: 'index',
        asyncData: async ({app}) => {
            await app.$api.users.createAction({body: { first_name: 'first', last_name: 'user' } });
            const {users} = await app.$api.users.allAction();

            let serverForceError;
            try {
                await app.$api.products.allAction({query: {force_error: 'true'}});
            } catch (err) {
                serverForceError = err.message;
            }

            return {
                users,
                serverForceError,
                data: await app.$api.users.categories.types.allAction()
            }
        },
        methods: {
            async handleClick() {
                this.data = await this.$api.users.getAction({params: {id: 1}});
            },
            async handleCreateUser() {
                await this.$api.users.createAction({body: {
                        first_name: 'nuxt',
                        last_name: 'neo'
                    }
                });
                const {users} = await this.$api.users.allAction();
                this.users = users;
            }
        }
    }
</script>
