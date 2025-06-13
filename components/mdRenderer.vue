<script lang="ts" setup>
    const props = defineProps<{
        content:string
    }>()

    const renderer = useParser()

    const value = computed(() => {
        return renderer.render(props.content)
    })
</script>

<template>
    <div v-html="value"></div>
</template>