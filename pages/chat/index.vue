<script setup lang="ts">
    const chatStore = useChatStore()
    const selectedModel = ref("")

    const handleSubmit = async(input: string) => {
        chatStore.setIsLoading(true)
        const res = await $fetch("/api/chat-create", {method:"POST", body: {
            message: input,
            modelId: selectedModel.value
        }})
        console.log(res)
        navigateTo(`/chat/${res.chatId}`)
        chatStore.setIsLoading(false)
    }
</script>

<template>
    <SidebarTrigger />
        <div class="flex flex-col h-full">
            <ModelSelector @select-model="(v) => selectedModel = v" />
            <ChatInput @submit="handleSubmit" />
        </div>
</template>