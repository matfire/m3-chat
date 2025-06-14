<script setup lang="ts">
    const chatStore = useChatStore()
    const selectedModel = ref("")
    const selectedProvider = ref("")

    const handleSubmit = async(input: string) => {
        chatStore.setIsLoading(true)
        const res = await $fetch("/api/chat-create", {method:"POST", body: {
            message: input,
            modelId: selectedModel.value,
            modelProvider: selectedProvider.value
        }})
        navigateTo(`/chat/${res.chatId}`)
        chatStore.setIsLoading(false)
    }

    const handleModelSelected = (provider: string, modelId:string) => {
        selectedModel.value = modelId
        selectedProvider.value = provider
    }
</script>

<template>
    <SidebarTrigger />
        <div class="flex flex-col h-full">
            <ModelSelector @select-model="handleModelSelected" />
            <ChatInput @submit="handleSubmit" />
        </div>
</template>