<script lang="ts" setup>
    const authStore = useAuthStore()
    await authStore.init()

    useSeoMeta({
        title: "M3Chat",
        description: "an AI chat tool for your every need"
    })
</script>

<template>
    <main class="w-full h-full">
        <slot />
    </main>
</template>