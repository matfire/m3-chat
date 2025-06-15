<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

    const store = useAuthStore()

    onMounted(() => {
        store.signOut()
    })
</script>

<template>
    <div class="min-h-screen flex flex-col justify-center items-center">
        <div class="w-full max-w-md">
            <Card>
                <CardContent>
                    <Loader2 class="animate-spin"/>
                    <p>Sign out, please wait...</p>
                </CardContent>
            </Card>
        </div>
    </div>
</template>