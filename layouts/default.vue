<script lang="ts" setup>
    const authStore = useAuthStore()
    await authStore.init()
</script>

<template>
    <main>
        <slot />
    </main>
</template>