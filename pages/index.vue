<script setup lang="ts">
import { motion } from 'motion-v';
</script>

<template>
    <section class="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen flex flex-col items-center justify-center space-y-4 text-white dark:text-white">
        <div class="flex flex-col items-center justify-center">
            <motion.h1
                :initial="{y: -20, opacity: 0}"
                :animate="{y:0, opacity: 1}"
                class="font-bold text-5xl">M3 Chat</motion.h1>
            <motion.span
                :initial="{y: -20, opacity: 0}"
                :animate="{y:0, opacity:1, transition: {delay: 0.3} }"
            >*Not affiliated with T3Chat or T3Tools</motion.span>
        </div>
        <motion.div
            :initial="{scale:0, opacity:0}"
            :animate="{scale:1, opacity: 1, transition: {delay: 0.6}}"
        >
            <Button as-child>
                <NuxtLink to="/connect">Get Started</NuxtLink>
            </Button>
        </motion.div>
    </section>

</template>