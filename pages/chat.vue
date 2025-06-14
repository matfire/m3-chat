<script lang="ts" setup>
import { generatePrivateChannel, NEW_CHAT, TITLE_UPDATED } from '~/lib/pusher/utils'

const { data, refresh } = await useFetch("/api/chat/all", { lazy: true })
const authStore = useAuthStore()

const route = useRoute()

const elements = ref<Array<{ id: string, title: string | null }>>(data.value || [])



onMounted(() => {

    const pusher = usePusher()

    const channel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, "titles"))
    channel.bind(TITLE_UPDATED, (data) => {
        const existingIndex = elements.value.findIndex(t => t.id === data.id);
        if (existingIndex !== -1) {
            elements.value[existingIndex].title = data.title;
        } else {
            elements.value.unshift(data);
        }
    })

    channel.bind(NEW_CHAT, (data) => {
        elements.value.unshift({title: data.title, id: data.id})
    })

})

const handleDelete = async (chatId: string) => {
    const data = await $fetch(`/api/chat/${chatId}`, {
        method: "DELETE"
    })
    const existingIndex = elements.value.findIndex(t => t.id === chatId);
    elements.value.splice(existingIndex, 1)
    if (route.params.id && route.params.id === chatId) {
        navigateTo("/chat")
    }
}
</script>

<template>
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <span class="text-xl font-bold">M3</span>
                <ThemeToggler />
                <Button>
                    <NuxtLink to="/chat">New Chat</NuxtLink>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu class="space-y-6">
                    <SidebarMenuItem v-for="chat in elements" :key="chat.id">
                        <SidebarMenuButton as-child>
                            <NuxtLink :to="`/chat/${chat.id}`">{{ chat.title }}</NuxtLink>
                            <Button @click="() => handleDelete(chat.id)">
                                DELETE
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
        <div class="px-4 py-2">
            <NuxtPage />
        </div>
    </SidebarProvider>
</template>