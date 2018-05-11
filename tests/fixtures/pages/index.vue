<template>
    <div class="index">
        <span class="path">{{ data.path }}</span>
        <span class="okay" v-if="data.ok">It's okay!</span>
        <span class="okay" v-else>It's not okay...</span>

        <button class="change-path" @click="handleClick">Change Path</button>
    </div>
</template>

<script>
    export default {
        name: 'index',
        asyncData: async function (context) {
            if (process.server) {
                return {
                    data: await context.req.generateControllersTree().users.categories.types.allAction()
                }
            }

            return {
                data: await context.app.$api.users.categories.types.allAction()
            }
        },
        methods: {
            async handleClick() {
                try {
                    this.data = await this.$api.users.allAction();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
</script>
