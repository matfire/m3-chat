<script lang="ts" setup>
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, NEW_CHAT, type MessageDoneSchema, type MessageUpdateSchema, type NewChatSchema } from '~/lib/pusher/utils'
import {Loader2} from"lucide-vue-next"
import type { Message } from '~/lib/db/schemas'
const route = useRoute()
const { $csrfFetch } = useNuxtApp()

const { data } = await useCsrfFetch(`/api/chat/${route.params.id}`, { method: "get" })
const chatStore = useChatStore()
const authStore = useAuthStore()

const messages = ref<Message[]>(data?.value?.messages ?? [])

const title = ref(data?.value?.chat?.title || "New Title")

onMounted(() => {
    const pusher = usePusher()
    const chatChannel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, `chat-${route.params.id}`))
    const titleChannel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, "titles"))
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
    titleChannel.bind(NEW_CHAT, (data: NewChatSchema) => {
        if (route.params.id == data.id) {
            title.value = data.title
        }
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
    const data = await $csrfFetch(`/api/chat/${route.params.id}`, {
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
        id: Math.floor(Math.random() * 100),
        status: 'done',
        reasoning: null,
        rendererReasoning: null,
        chatId: route.params.id! as string
    }, {...data, content: "", reasoning: ""})
}
</script>

<template>
    <div class="flex flex-col h-full w-full space-y-6">
        <div class="flex items-center space-x-2">
            <SidebarTrigger />
            <h1 class="text-2xl font-bold">{{ title }}</h1>
        </div>
        <div class="flex flex-col space-y-4 flex-1 w-full">
            <div v-if="data && 'messages' in data" v-for="message in messages" :key="message.id"
                :class="{ 'justify-end': message.sender === 'assistant', 'w-full flex': true }">
                <Card class="w-3/4">
                    <CardContent class="p-4">
                        <p v-if="message.sender === 'user'" class="">
                            {{ message.content }}
                        </p>
                        <div v-if="message.sender === 'assistant'">
                            <div v-if="message.reasoning">
                                <Accordion type="single" collapsible>
                                    <AccordionItem :value="message.id + '-reasoning'">
                                        <AccordionTrigger>Reasoning</AccordionTrigger>
                                        <AccordionContent>
                                            <div class="w-full text-wrap space-y-2" v-html="message.rendererReasoning" v-if="message.rendererReasoning" />
                                            <MdRenderer v-else-if="message.reasoning" :content="message.reasoning" />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div class="space-y-2" v-html="message.rendererContent" v-if="message.rendererContent" />
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