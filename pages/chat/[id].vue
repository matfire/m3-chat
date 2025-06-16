<script lang="ts" setup>
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, type MessageDoneSchema, type MessageUpdateSchema } from '~/lib/pusher/utils'
import type { MessageSender, MessageStatus } from '~/lib/types/chat'
import {Loader2} from"lucide-vue-next"
const route = useRoute()
const { data } = await useFetch(`/api/chat/${route.params.id}`, { method: "get" })
const chatStore = useChatStore()
const authStore = useAuthStore()

const messages = ref<{id: string, content: string | null, rendererContent: string | null, sender: MessageSender, status: MessageStatus, reasoning: string | null, rendererReasoning: string | null}[]>(data?.value?.messages ?? [])

onMounted(() => {
    const pusher = usePusher()
    const chatChannel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, `chat-${route.params.id}`))
    chatChannel.bind(MESSAGE_UPDATE_EVENT, (data: MessageUpdateSchema) => {
        if (data.type === "text") {
            appendToLastMessage(data.text, "text")
        } else if (data.type === "reasoning") {
            appendToLastMessage(data.text, "reasoning")
        }
    })
    chatChannel.bind(MESSAGE_DONE_EVENT, (data: MessageDoneSchema) => {
        messages.value[messages.value.length - 1].status = "done"
        chatStore.setIsLoading(false)
    })
})

const appendToLastMessage = (content: string, type: "text" | "reasoning") => {
    if (type === "reasoning") {
            messages.value[messages.value.length - 1].reasoning += content
    } else if (type === "text") {
        messages.value[messages.value.length - 1].content += content
    }
}

const handleSubmit = async (value: string) => {
    chatStore.setIsLoading(true)
    const data = await $fetch(`/api/chat/${route.params.id}`, {
        method: "post",
        body: {
            lastMessage: value,
            createMessage: true
        }
    })
    messages.value.push({
        content: value,
        sender: "user",
        rendererContent: null,
        id: crypto.randomUUID(),
        status: 'done',
        reasoning: null,
        rendererReasoning: null
    }, data)
}
</script>

<template>
    <div class="flex flex-col h-full space-y-6">
        <div class="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 class="text-2xl font-bold">{{ data?.chat.title }}</h1>
        </div>
        <div class="flex flex-col space-y-4 flex-1">
            <div v-if="data && 'messages' in data" v-for="message in messages" :key="message.id"
                :class="{ 'self-end': message.sender === 'assistant', 'max-w-3/4': true }">
                <Card class="w-fit">
                    <CardContent>
                        <p v-if="message.sender === 'user'">
                            {{ message.content }}
                        </p>
                        <div v-if="message.sender === 'assistant'">
                            <div v-if="message.reasoning">
                                <Accordion type="single" collapsible>
                                    <AccordionItem :value="message.id + '-reasoning'">
                                        <AccordionTrigger>Reasoning</AccordionTrigger>
                                        <AccordionContent>
                                            <div v-html="message.rendererReasoning" v-if="message.rendererReasoning" />
                                            <MdRenderer v-else-if="message.reasoning" :content="message.reasoning" />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div v-html="message.rendererContent" v-if="message.rendererContent" />
                            <MdRenderer v-else-if="message.content" :content="message.content" />
                        </div>
                        <Loader2 class="animate-spin" v-if="message.status === 'generating'" />
                    </CardContent>
                </Card>
            </div>
        </div>
        <div>
            <ChatInput @submit="handleSubmit" />
        </div>
    </div>
</template>