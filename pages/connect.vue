<script lang="ts" setup>
import {Loader2} from "lucide-vue-next"
    const authStore = useAuthStore()

</script>

<template>
    <div class="min-h-screen flex flex-col justify-center items-center">
        <div class="w-full max-w-md">
            <Card>
                <CardHeader class="text-center">
                    <CardTitle class="text-center text-2xl font-bold">Welcome to M3-Chat</CardTitle>
                    <CardDescription>Sign up using one of the providers below</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 gap-3">
                        <Button :disabled="authStore.loading" variant="outline" class="w-full" @click="authStore.signInSocial('github')">
                            <Loader2 v-if="authStore.loading" class="w-4 h-4 mr-2 animate-spin" />
                            <Icon name="uil:github" class="h-4 w-4 mr-2" />
                            GitHub
                        </Button>
                        <Button :disabled="authStore.loading" variant="outline" class="w-full" @click="authStore.signInSocial('google')">
                                <Loader2 v-if="authStore.loading" class="w-4 h-4 mr-2 animate-spin" />
                            <Icon name="uil:google" class="h-4 w-4 mr-2" />
                            Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>