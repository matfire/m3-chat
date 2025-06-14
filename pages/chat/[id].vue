<script lang="ts" setup>
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, type MessageDoneSchema, type MessageUpdateSchema } from '~/lib/pusher/utils'

    const route = useRoute()
    const {data} = await useFetch(`/api/chat/${route.params.id}`, {lazy: true, method:"get"})
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    const currentMessageStreaming = ref("")
    onMounted(() => {
        const pusher = usePusher()
        const chatChannel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, `chat-${route.params.id}`))
        chatChannel.bind(MESSAGE_UPDATE_EVENT, (data: MessageUpdateSchema) => {
            currentMessageStreaming.value += data.text
        })
        chatChannel.bind(MESSAGE_DONE_EVENT, (data: MessageDoneSchema) => {
            console.log(data)
            chatStore.setIsLoading(false)
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
            <h1 class="text-2xl font-bold">{{ data?.chat.title }}</h1>
        </div>
        <div class="flex flex-col space-y-4 flex-1">
            <div v-if="data && 'messages' in data" v-for="message in data.messages" :key="message.id" :class="{'self-end' : message.sender === 'assistant', 'max-w-3/4': true}">
                <Card class="w-fit">
                    <CardContent>
                        <p v-if="message.sender === 'user'">
                            {{ message.content }}
                        </p>
                        <div v-if="message.sender === 'assistant'">
                            <div v-html="message.rendererContent" v-if="message.rendererContent" />
                            <MdRenderer v-else-if="message.content" :content="message.content" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div v-if="currentMessageStreaming" class="max-w-3/4 self-end">
                <Card class="w-fit">
                    <CardContent>
                        <MdRenderer :content="currentMessageStreaming" />
                    </CardContent>
                </Card>
            </div>
        </div>
        <div>
            <ChatInput @submit="handleSubmit" />
        </div>
    </div>
</template>