<script lang="ts" setup>
import Prompt from './Prompt.vue'
import { onMounted, ref, type Ref } from 'vue'
import gridImage from '../assets/grid.png'
import { generateImage } from '../lib/OpenAI'

const container: Ref<HTMLDivElement> = ref(null) as any
const canvas: Ref<HTMLCanvasElement> = ref(null) as any

type Node = { x: number; y: number; img: string; id: string; backlinks: string[]; pointsTo: string[] }

const nodes: Ref<Node[]> = ref([
    {
        x: 100,
        y: 200,
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png',
        id: '1',
        backlinks: [],
        pointsTo: ['2'],
    },
    {
        x: 500,
        y: 400,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s',
        id: '2',
        backlinks: ['1'],
        pointsTo: [],
    },
])
const nodeLookup: Record<string, Node> = {
    '1': nodes.value[0],
    '2': nodes.value[1],
}

let lastMouseX = 0
let lastMouseY = 0
let isMouseDown = false

const viewOffsetX = ref(0)
const viewOffsetY = ref(0)

function render() {
    const ctx = canvas.value.getContext('2d')

    console.log(canvas.value.width)

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    ctx.lineWidth = 4
    ctx.strokeStyle = 'pink'

    for (const node of nodes.value) {
        for (const connection of node.pointsTo) {
            const otherNode = nodeLookup[connection]

            ctx.beginPath()
            ctx.moveTo(node.x + viewOffsetX.value, node.y + viewOffsetY.value)
            ctx.lineTo(otherNode.x + viewOffsetX.value, otherNode.y + viewOffsetY.value)
            ctx.stroke()
        }
    }
}

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

    render()
}

function mouseUp(event: MouseEvent) {
    isMouseDown = false
}

onMounted(() => {
    new ResizeObserver(() => {
        const width = container.value.offsetWidth
        const height = container.value.offsetHeight
        canvas.value.width = width
        canvas.value.height = height

        render()
    }).observe(container.value)
})

async function addNewNode(prompt: string, backlinks: string[]) {
    const image = await generateImage(prompt)

    const id = Math.random().toString()

    const node = {
        x: Math.random() * 600,
        y: Math.random() * 600,
        img: image,
        id,
        backlinks: backlinks,
        pointsTo: [],
    }

    nodes.value.push(node)
    nodeLookup[id] = node

    for (const backlink of backlinks) {
        nodeLookup[backlink].pointsTo.push(id)
    }
}
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

        <canvas class="absolute top-0 left-0 w-full h-full bg-amber-700/20 pointer-events-none" ref="canvas" />

        <div
            v-for="node in nodes"
            class="absolute w-24 h-24 border-2 border-slate-400 rounded hover:scale-110"
            :style="{
                left: `${viewOffsetX + node.x}px`,
                top: `${viewOffsetY + node.y}px`,
            }"
        >
            <img class="w-full h-full object-cover select-none rounded" :src="node.img" draggable="false" />
        </div>

        <Prompt
            class="absolute w-48 h-10"
            :style="{
                left: `${viewOffsetX}px`,
                top: `${viewOffsetY}px`,
            }"
            @prompt="addNewNode"
        />
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
