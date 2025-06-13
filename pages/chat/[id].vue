<script lang="ts" setup>
    const route = useRoute()
    const data = await useFetch(`/api/chat/${route.params.id}`)
    const chatStore = useChatStore()
    const mdParser = useParser()

    onMounted(() => {
        const pusher = usePusher()
        
        const chatChannel = pusher.subscribe(`chat-${route.params.id}`)
        chatChannel.bind('new_chunk', (data) => {
            console.log(data)
        })
        chatChannel.bind('message_done', (data) => {
            console.log(data)
        })
    })

    const handleSubmit = async(value: string) => {
        chatStore.setIsLoading(true)
        await $fetch(`/api/chat/${route.params.id}`, {
            method: "post",
            body: {
                lastMessage: value,
                createMessage: true
            }
        })
    }
</script>

<template>
    <div class="flex flex-col h-full space-y-6">
        <div class="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 class="text-2xl font-bold">{{ data.data.value?.chat.title }}</h1>
        </div>
        <div class="flex flex-col space-y-4 flex-1">
            <div v-for="message in data.data.value?.messages" :key="message.id" :class="{'self-end' : message.sender === 'assistant', 'max-w-3/4': true}">
                <Card class="w-fit">
                    <CardContent>
                        <p v-if="message.sender === 'user'">
                            {{ message.content }}
                        </p>
                        <MdRenderer v-else :content="message.content" />
                    </CardContent>
                </Card>
            </div>
        </div>
        <div>
            <ChatInput @submit="handleSubmit" />
        </div>
    </div>
</template>