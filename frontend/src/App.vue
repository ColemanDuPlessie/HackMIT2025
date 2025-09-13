<script setup lang="ts">
import Canvas from './components/Canvas.vue'

import { ref } from 'vue'
import { generateImage } from './lib/unified_imggen'
// @ts-ignore: No type definitions for this module
const MODELS = { dummy: 'Random Dummy Image', 'dall-e-3': 'dall-E 3', 'dall-e-2': 'dall-E 2', 'stable-diffusion-xl-1.0': 'Stable Diffusion XL 1.0' }

const imageSrc = ref('null')

const selectedModel = ref('dummy')

async function generate() {
    var output: string | Response | undefined = await generateImage(selectedModel.value, 'A robot talking to a puppy')
    console.log('Generated image URL:', output)
    if (output instanceof Response) {
        output = output['url']
    } else if (output === undefined) {
        output = 'https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX'
    } else {
        // Output is a string
    }
    imageSrc.value = output as string
}
</script>

<template>
    <div class="mb-4 flex gap-4">
        <label v-for="(key, name) in MODELS" :key="name">
            <input type="radio" :value="name" v-model="selectedModel" />
            {{ key }}
        </label>
    </div>
    <h1 class="text-3xl font-bold underline">Hack MIT 2025 Project</h1>

    <button @click="generate">Generate</button>

    <div class="flex flex-col w-screen h-screen">
        <div class="flex grow">
            <Canvas class="grow" />
        </div>
    </div>
</template>

<style scoped></style>
