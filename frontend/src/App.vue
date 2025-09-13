<script setup lang="ts">
import { ref } from 'vue';
import { generateImage } from './lib/OpenAI';

const imageSrc = ref('null')

async function generate() {
    imageSrc.value = await generateImage()
}
</script>

<template>
 <h1 class="text-3xl font-bold underline">Hack MIT 2025 Project</h1>

    <button @click="generate">Generate</button>

    <img :src="imageSrc" />

 <div class="flex">
  <div class="grow-4 bg-red"></div>
  <div class="grow-1 bg-blue"></div>
 </div>
</template>

<style scoped>

</style>
