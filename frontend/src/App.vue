<script setup lang="ts">
import Prompt from './components/Prompt.vue'
import ModelPicker from './components/ModelPicker.vue'
import Canvas from './components/Canvas.vue'
import { ref } from 'vue'
import { addNewNode, selectedNodes, viewOffsetX, viewOffsetY } from './lib/State'

// Global type augmentation to include selectedModel in window
declare global {
    interface Window {
        selectedModel: string
    }
}

const showMenu = ref(false)
const showInstructions = ref(false)

function openInstructions() {
    showInstructions.value = true
    showMenu.value = false
}
function closeInstructions() {
    showInstructions.value = false
}

function prompt(prompt: string) {
    if (selectedNodes.value.length === 0) {
        addNewNode(prompt, [], viewOffsetX.value, viewOffsetY.value)
    } else if (selectedNodes.value.length === 1) {
        addNewNode(prompt, [selectedNodes.value[0].id], selectedNodes.value[0].x + Math.random() * 100, selectedNodes.value[0].y + Math.random() * 100)
    } else if (selectedNodes.value.length > 1) {
        addNewNode(
            prompt,
            selectedNodes.value.map(node => node.id),
            selectedNodes.value[0].x + Math.random() * 100,
            selectedNodes.value[0].y + Math.random() * 100
        )
    }
}
</script>

<template>
    <div class="flex flex-col w-screen h-screen">
        <div class="flex grow">
            <Canvas class="grow" />
        </div>
    </div>

    <div class="absolute left-0 bottom-0 flex w-full pb-4 px-8 gap-8">
        <ModelPicker />
        <Prompt class="grow" @prompt="prompt" />
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
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
