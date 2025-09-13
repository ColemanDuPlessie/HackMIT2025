<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['prompt'])

const prompt = ref('')

function keydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return

    emit('prompt', prompt.value)
}
</script>

<template>
    <div class="bg-slate-600 border-2 border-slate-400 text-white flex px-2 py-0 overflow-auto rounded">
        <input
            type="text"
            v-model="prompt"
            placeholder="Prompt :D"
            class="min-w-0 placeholder:text-gray-300 placeholder:italic outline-none border-none"
            @keydown="keydown"
        />
    </div>
</template>
