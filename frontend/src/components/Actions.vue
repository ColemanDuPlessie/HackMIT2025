<script lang="ts" setup>
import { onMounted } from 'vue'
import { deleteSelectedNodes, nodes, viewOffsetX, viewOffsetY } from '../lib/State'

let xOffset = 0
let yOffset = 0

function goHome() {
    let sumX = 0
    let sumY = 0

    for (const node of nodes.value) {
        sumX += node.x
        sumY += node.y
    }

    const averageX = sumX / nodes.value.length
    const averageY = sumY / nodes.value.length

    xOffset = averageX - (-viewOffsetX.value + document.body.offsetWidth / 2)
    yOffset = averageY - (-viewOffsetY.value + document.body.offsetHeight / 2)

    console.log(viewOffsetX.value, viewOffsetY.value)
    console.log(averageX, averageY)
    console.log(xOffset, yOffset)

    // viewOffsetX.value -= xOffset
    // viewOffsetY.value -= yOffset
}

let lastTime = Date.now()

function update() {
    const now = Date.now()
    const deltaTime = ((now - lastTime) / 1000) * 4
    lastTime = now

    const movementX = xOffset * deltaTime
    const movementY = yOffset * deltaTime

    viewOffsetX.value -= movementX
    viewOffsetY.value -= movementY

    xOffset -= movementX
    yOffset -= movementY

    requestAnimationFrame(update)
}

onMounted(() => {
    update()
})
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
            @click="goHome"
        >
            <span class="material-symbols-outlined text-[var(--color-text-alt)] block"> home </span>
        </button>
    </div>
</template>

<style scoped></style>
