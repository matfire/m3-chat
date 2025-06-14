<script lang="ts" setup>
import { generatePrivateChannel } from '~/lib/pusher/utils'

const { data, refresh } = await useFetch("/api/chat/all", {lazy:true})
const authStore = useAuthStore()

const route = useRoute()

onMounted(() => {

    const pusher = usePusher()

    const channel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, "titles"))
    channel.bind("title_updated", (data) => {
        console.log(data)
    })

})

const handleDelete = async(chatId: string) => {
    const data = await $fetch(`/api/chat/${chatId}`, {
        method: "DELETE"
    })
    console.log(data)
    refresh()
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
                    <SidebarMenuItem v-for="chat in data" :key="chat.id">
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