<script lang="ts" setup>
import { Trash } from 'lucide-vue-next'
import { generatePrivateChannel, NEW_CHAT, TITLE_UPDATED, type NewChatSchema, type TitleUpdatedSchema } from '~/lib/pusher/utils'
const { $csrfFetch } = useNuxtApp()
const { data } = await useCsrfFetch("/api/chat/all")
const authStore = useAuthStore()

const route = useRoute()

const elements = ref<Array<{ id: string, title: string | null }>>(data.value || [])



onMounted(() => {

    const pusher = usePusher()

    const channel = pusher.subscribe(generatePrivateChannel(authStore.user?.id, "titles"))
    channel.bind(TITLE_UPDATED, (data: TitleUpdatedSchema) => {
        const existingIndex = elements.value.findIndex(t => t.id === data.id);
        if (existingIndex !== -1) {
            elements.value[existingIndex].title = data.title;
        } else {
            elements.value.unshift(data);
        }
    })

    channel.bind(NEW_CHAT, (data: NewChatSchema) => {
        elements.value.unshift({title: data.title, id: data.id})
    })

})

const handleDelete = async (chatId: string) => {
    await $csrfFetch(`/api/chat/${chatId}`, {
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
                <div class="flex justify-between w-full">
                    <p class="text-xl font-bold">M3</p>
                    <DropdownMenu v-if="authStore.user">
                        <DropdownMenuTrigger as-child>
                            <Avatar>
                                <AvatarImage v-if="authStore.user.image" :src="authStore.user.image" />
                                <AvatarFallback>{{ authStore.user.name.slice(0, 2) }}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem as-child>
                                <NuxtLink to="/settings">
                                    Settings
                                </NuxtLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem as-child>
                                <NuxtLink to="/out">
                                    Sign Out
                                </NuxtLink>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button as-child>
                    <NuxtLink to="/chat">New Chat</NuxtLink>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu class="space-y-6">
                    <SidebarMenuItem v-for="chat in elements" :key="chat.id">
                        <SidebarMenuButton as-child class="flex space-x-2">
                            <div class="flex space-x-2 items-center h-fit">
                                <NuxtLink :to="`/chat/${chat.id}`">{{ chat.title }}</NuxtLink>
                                <Button variant="destructive" @click.stop="() => handleDelete(chat.id)">
                                    <Trash />
                                </Button>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
        <div class="px-4 py-2 w-full">
            <NuxtPage />
        </div>
    </SidebarProvider>
</template>