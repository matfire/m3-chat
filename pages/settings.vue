<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

    const {data: profile, refresh} = await useFetch("/api/profile")
    const {data: providers} = await useFetch("/api/providers/categories")

    const keysData = ref<Record<string, string>>({})

    const loading = ref(false)

    effect(() => {
        providers.value?.filter((e) => e.byok).forEach((provider) => {
            keysData.value[provider.provider] = profile?.value?.data && provider.provider in profile.value.data ? profile.value.data[provider.provider] : ""
        })
    })

    const handleSubmit = async() => {
        const toastId = toast.loading("saving your keys")
        loading.value = true
        await $fetch('/api/profile/keys', {
            method: "POST",
            body: {
                profileId: profile.value?.id,
                keys: keysData.value
            }
        })
        await refresh()
        toast.success("keys saved!", {id: toastId})
        loading.value = false
    }

</script>

<template>
    <div class="px-4 w-full py-4 h-full max-h-screen">
        <div>
            <NuxtLink to="/chat">Back to chat</NuxtLink>
        </div>
        <div class="w-full flex justify-center flex-col items-center h-full">
            <Card class="min-w-1/2">
                <CardContent>
                    <Tabs default-value="account">
                        <TabsList class="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="keys">Your Keys</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account" class="p-4">
                            <div class="flex flex-col space-y-6">
                                <div>
                                    <div class="flex items-center space-x-2">
                                        <span>Choose Color Theme</span>
                                        <ThemeToggler />
                                    </div>
                                </div>
                                <div class="flex flex-col space-y-4">
                                    <Button as-child variant="outline">
                                        <NuxtLink to="/out">Log Out</NuxtLink>
                                    </Button>
                                    <Button variant="destructive">
                                        Delete my account
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="keys" class="p-4">
                                <form class="space-y-6" @submit.prevent="handleSubmit">
                                    <div v-for="(key, provider) in keysData" :key="provider" class="flex flex-col space-y-4">
                                        <Label>Key for {{ provider }}</Label>
                                        <Input v-model="keysData[provider]" :disabled="loading" />
                                    </div>
                                    <Button :disabled="loading" class="w-full">
                                        <Loader2 v-if="loading" class="animate-spin" />
                                        <span>
                                            Save
                                        </span>
                                    </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    </div>
</template>