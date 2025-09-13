<script setup lang="ts">
import Prompt from './components/Prompt.vue'
import Canvas from './components/Canvas.vue'
import { ref, watch } from 'vue'
import { generateImage } from './lib/unified_imggen'

// Global type augmentation to include selectedModel in window
declare global {
    interface Window {
        selectedModel: string
    }
}

// Add instruct-pix2pix to the models list
const MODELS = { dummy: 'Random Dummy Image', 'dall-e-3': 'dall-E 3', 'dall-e-2': 'dall-E 2', 'stable-diffusion-xl-1.0': 'Stable Diffusion XL 1.0', 'instruct-pix2pix': 'InstructPix2Pix' }
const imageSrc = ref('null')
const selectedModel = ref('dummy')
const showMenu = ref(false)
const showInstructions = ref(false)
const canvasRef = ref()

window.selectedModel = selectedModel.value
watch(selectedModel, val => {
    window.selectedModel = val
})

// Example: generate function uses selected model
async function generate() {
    var output: string | Response | undefined = await generateImage(selectedModel.value, 'A robot talking to a puppy')
    console.log('Generated image URL:', output)
    if (output instanceof Response) {
        output = output['url']
    } else if (output === undefined) {
        output = 'https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX'
    }
    imageSrc.value = output as string
}

function openInstructions() {
    showInstructions.value = true
    showMenu.value = false
}
function closeInstructions() {
    showInstructions.value = false
}

// File upload logic: adds a new, unconnected node to Canvas
function triggerFilePicker() {
  document.getElementById('navbarFileInput')?.click()
}

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]
  const reader = new FileReader()
  reader.onload = () => {
    const imgSrc = reader.result as string
    // Add as a separate node (no backlinks)
    canvasRef.value?.addNewNode?.('Uploaded Image', [], 300, 300, imgSrc)
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="mb-4 flex gap-4 sticky-model-row items-center">
    <label
      v-for="(key, name) in MODELS"
      :key="name"
      :class="{ selected: selectedModel === name }">
      <input type="radio" :value="name" v-model="selectedModel" class="modelSelector" />
      <span>{{ key }}</span>
    </label>
    <!-- Upload button styled to match other buttons -->
    <button
      @click="triggerFilePicker"
      class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition-colors"
    >
      Upload Image
    </button>
    <input
      id="navbarFileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileUpload"
    />
  </div>

  <div class="flex flex-col w-screen h-screen">
    <div class="flex grow">
      <!-- Bind ref to Canvas to call addNewNode -->
      <Canvas class="grow" ref="canvasRef" />
    </div>
  </div>

  <!-- Hamburger Menu -->
  <div class="fixed top-4 right-4 z-50">
    <button @click="showMenu = !showMenu" class="flex flex-col justify-center items-center w-10 h-10 bg-slate-800 rounded shadow-lg focus:outline-none">
      <span class="block w-6 h-0.5 bg-white mb-1 transition-all duration-300" :class="showMenu ? 'rotate-45 translate-y-2' : ''"></span>
      <span class="block w-6 h-0.5 bg-white mb-1 transition-all duration-300" :class="showMenu ? 'opacity-0' : ''"></span>
      <span class="block w-6 h-0.5 bg-white transition-all duration-300" :class="showMenu ? '-rotate-45 -translate-y-2' : ''"></span>
    </button>
    <transition name="fade-slide">
      <div v-if="showMenu" class="absolute mt-2 right-0 bg-black text-white rounded shadow-lg min-w-[160px] p-4">
        <div class="mb-2 font-bold">Menu</div>
        <ul>
          <li class="py-1 hover:bg-gray-700 rounded px-2 cursor-pointer" @click="showMenu = false">Home</li>
          <!-- <li class="py-1 hover:bg-gray-700 rounded px-2 cursor-pointer" @click="showMenu = false">Settings</li> -->
          <li class="py-1 hover:bg-gray-700 rounded px-2 cursor-pointer" @click="openInstructions">Instructions</li>
        </ul>
      </div>
    </transition>
  </div>

  <!-- Instructions Modal -->
  <transition name="fade-slide">
    <div v-if="showInstructions" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-black text-white rounded-lg p-8 max-w-lg w-full relative">
        <button @click="closeInstructions" class="absolute top-2 right-2 text-xl font-bold text-white">&times;</button>
        <h2 class="text-2xl font-bold mb-4">Instructions</h2>
        <ul class="list-disc pl-6 space-y-2 text-base">
          <li>WRITE INSTRUCTIONS</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.selected {
  font-weight: bold;
  color: #a78bfa; /* purple-400 */
}
.modelSelector {
  margin-right: 0.5rem;
}
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
