<script lang="ts" setup>
import { deleteSelectedNodes } from '../lib/State'
</script>

<template>
    <div class="flex bg-[var(--color-element)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl cursor-pointer relative z-10">
        <button
            class="flex cursor-pointer items-center px-1.5 m-1 grow select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
            @click="deleteSelectedNodes"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> delete </span>
        </button>

        <button
            class="flex cursor-pointer items-center px-1.5 m-1 grow select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> add_photo_alternate </span>
        </button>

        <button
            class="flex cursor-pointer items-center px-1.5 m-1 grow select-none hover:bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition-colors duration-100 ease-in-out hover:duration-0"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> home </span>
        </button>
    </div>
</template>

<style scoped></style>
