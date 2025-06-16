<script lang="ts" setup>
    const authStore = useAuthStore()
    await authStore.init()
</script>

<template>
    <main class="w-full h-full">
        <slot />
    </main>
</template>