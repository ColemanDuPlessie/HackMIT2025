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
    <div class="flex bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] overflow-auto rounded-xl">
        <input
            type="text"
            v-model="prompt"
            placeholder="Begin with a new idea..."
            class="min-w-0 placeholder:text-[var(--color-text-alt)] outline-none border-none px-4 py-3 grow h-full"
            @keydown="keydown"
        />

        <button
            class="bg-[var(--color-accent)] rounded-md flex items-center justify-center w-8 m-2 cursor-pointer hover:bg-[var(--color-accent-hover)] transition-all duration-100 ease-in-out"
            @click="emit('prompt', prompt)"
        >
            <span class="material-symbols-outlined text-[var(--color-accent-button)] block"> add </span>
        </button>
    </div>
</template>
