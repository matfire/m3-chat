<script setup lang="ts">
    const chatStore = useChatStore()
    const emit = defineEmits<{
        submit: [value: string]
    }>()

    const value = ref("")

    const handleSubmit = (e) => {
        e.preventDefault()
        emit('submit', value.value)
        value.value = ""
    }
</script>

<template>
    <form @submit="handleSubmit">
        <Input :disabled="chatStore.loading" v-model="value" type="text" placeholder="what's up doc?" />
    </form>
</template>