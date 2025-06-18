<script setup lang="ts">
    const chatStore = useChatStore()
    const { $csrfFetch } = useNuxtApp()

    const selectedModel = ref("")
    const selectedProvider = ref("")

    const handleSubmit = async(input: string) => {
        chatStore.setIsLoading(true)
        const res = await $csrfFetch("/api/chat-create", {method:"POST", body: {
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
    <div class="flex flex-col h-full">
            <SidebarTrigger />
            <div class="flex-1 flex flex-col items-center justify-center">
                <h1 class="font-bold text-3xl">Use the Form below to start a new chat</h1>
            </div>
            <ModelSelector @select-model="handleModelSelected" />
            <ChatInput @submit="handleSubmit" />
        </div>
</template>