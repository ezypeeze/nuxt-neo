<template>
    <div class="index">
        <span v-if="data.ok">It's okay!</span>
        <span v-else>It's not okay...</span>
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
        }
    }
</script>