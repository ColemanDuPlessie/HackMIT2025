<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import gridImage from '../assets/grid.png'

const container: Ref<HTMLDivElement> = ref(null) as any
const canvas: Ref<HTMLCanvasElement> = ref(null) as any

const nodes: { x: number; y: number; img: string }[] = [
    {
        x: 100,
        y: 200,
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png',
    },
    {
        x: 500,
        y: 400,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s',
    },
]

let lastMouseX = 0
let lastMouseY = 0
let isMouseDown = false

const viewOffsetX = ref(0)
const viewOffsetY = ref(0)

function mouseDown(event: MouseEvent) {
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    isMouseDown = true
}

function mouseMove(event: MouseEvent) {
    if (!isMouseDown) return

    const mouseX = event.clientX
    const mouseY = event.clientY

    const deltaX = mouseX - lastMouseX
    const deltaY = mouseY - lastMouseY

    lastMouseX = mouseX
    lastMouseY = mouseY

    viewOffsetX.value += deltaX
    viewOffsetY.value += deltaY
}

function mouseUp(event: MouseEvent) {
    isMouseDown = false
}

onMounted(() => {
    // new ResizeObserver(() => {
    //     const width = container.value.offsetWidth
    //     const height = container.value.offsetHeight
    //     canvas.value.width = width
    //     canvas.value.height = height
    // }).observe(container.value)
})
</script>

<template>
    <div class="bg-slate-800 overflow-hidden" ref="container">
        <div
            class="relative grid"
            :style="{
                'background-image': `url(${gridImage})`,
                'image-rendering': 'crisp-edges',
                left: `${(viewOffsetX % 24) - 24}px`,
                top: `${(viewOffsetY % 24) - 24}px`,
            }"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
        ></div>

        <div
            v-for="node in nodes"
            class="absolute w-24 h-24 border-2 border-slate-400 rounded hover:scale-110"
            :style="{
                left: `${viewOffsetX + node.x}px`,
                top: `${viewOffsetY + node.y}px`,
            }"
        >
            <img class="w-full h-full object-cover select-none" :src="node.img" draggable="false" />
        </div>
        <!-- <img  class="w-full h-full"  :src="gridImage" /> -->

        <!-- <canvas class="w-full h-full" ref="canvas"></canvas> -->
    </div>
</template>

<style scoped>
.grid {
    width: calc(100% + 48px);
    height: calc(100% + 48px);
}
</style>
