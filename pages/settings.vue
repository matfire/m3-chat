<script setup lang="ts">
    const authStore = useAuthStore()

    if (!authStore.user) {
        navigateTo("/connect")
    }
</script>

<template>
    <div>wip</div>
</template>