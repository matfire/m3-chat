<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

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
    <form @submit="handleSubmit" class="flex space-x-2">
        <Input :disabled="chatStore.loading" v-model="value" type="text" placeholder="what's up doc?" />
        <Button :disabled="chatStore.loading">
            <Loader2 v-if="chatStore.loading" class="animate-spin" />
            <span>Send</span>
        </Button>
    </form>
</template>