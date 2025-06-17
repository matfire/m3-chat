<script setup lang="ts">
import 'vue-sonner/style.css'
</script>

<template>
  <div>
    <Toaster />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
