<script setup lang="ts">
import Canvas from './components/Canvas.vue'

import { ref } from 'vue'
import { generateImage } from './lib/OpenAI'

const imageSrc = ref('null')

async function generate() {
    imageSrc.value = await generateImage()
}
</script>

<template>
    <div class="flex flex-col w-screen h-screen">
        <div class="flex grow">
            <Canvas class="grow" />
        </div>
    </div>
</template>

<style scoped></style>
