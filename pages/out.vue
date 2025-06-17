<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

    const store = useAuthStore()

onMounted(async () => {
    try {
        await store.signOut()
    } catch (err) {
        console.error(err)
        toast.error('Unable to sign out – please try again.')
    }
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