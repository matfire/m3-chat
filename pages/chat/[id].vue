<script lang="ts" setup>
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT } from '~/lib/pusher/utils'

    const route = useRoute()
    const {data} = await useFetch(`/api/chat/${route.params.id}`, {lazy: true})
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    onMounted(() => {
        const pusher = usePusher()
        
        const chatChannel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, `chat-${route.params.id}`))
        chatChannel.bind_global((event, data) => {
            console.log(event, data)
        })
        chatChannel.bind(MESSAGE_UPDATE_EVENT, (data) => {
            console.log(data)
        })
        chatChannel.bind(MESSAGE_DONE_EVENT, (data) => {
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
            <h1 class="text-2xl font-bold">{{ data?.chat.title }}</h1>
        </div>
        <div class="flex flex-col space-y-4 flex-1">
            <div v-for="message in data.messages" :key="message.id" :class="{'self-end' : message.sender === 'assistant', 'max-w-3/4': true}">
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