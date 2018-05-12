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
        asyncData: asyncData({
            data: ({app}) => app.$api.users.categories.types.allAction()
        }),
        methods: {
            async handleClick() {
                this.data = await this.$api.users.allAction();
            }
        }
    }
</script>
