<script lang="ts" setup>
import { computedAsync } from '@vueuse/core';
import { getParser } from '~/lib/md/parser';

    const props = defineProps<{
        content:string
    }>()

    const renderer = getParser()

    const value = computedAsync(async() => {
        if (!props.content) return ""
        return await renderer.process(props.content)
    }, null)
</script>

<template>
    <div class="space-y-2" v-html="value"></div>
</template>