<script lang="ts" setup>
import Prompt from './Prompt.vue'
import { onMounted, ref, type Ref } from 'vue'
import gridImage from '../assets/grid.png'
import { generateImage, modifyImage } from '../lib/OpenAI'

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

const promptLocationX = ref(0)
const promptLocationY = ref(0)
const promptOpenNode = ref(null)

function render() {
    const ctx = canvas.value.getContext('2d')

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    ctx.lineWidth = 1
    ctx.strokeStyle = '#4C4C44'
    var diffX, diffY, diffDist
    for (const node of nodes.value) {
        for (const connection of node.pointsTo) {
            const otherNode = nodeLookup[connection]

            
            ctx.lineWidth = 4
            ctx.strokeStyle = 'pink'

            ctx.beginPath()
            ctx.moveTo(node.x + viewOffsetX.value + 50, node.y + viewOffsetY.value + 50)
            ctx.lineTo(otherNode.x + viewOffsetX.value + 50, otherNode.y + viewOffsetY.value + 50)
            ctx.stroke()

            diffX = otherNode.x - node.x
            diffY = otherNode.y - node.y
            diffDist = Math.sqrt(diffX * diffX + diffY * diffY)

            ctx.beginPath()
            ctx.moveTo(node.x + viewOffsetX.value+50, node.y + viewOffsetY.value+50)
            ctx.lineTo(otherNode.x + viewOffsetX.value+50, otherNode.y + viewOffsetY.value+50)
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

let lastTime = Date.now()

const repulsion = 10000
const repulsionPower = 2
const attraction = 2 / 10000
const attractionPower = 1
const linkedAttractionMultiplier = 3

function update() {
    const now = Date.now()
    const deltaTime = (now - lastTime) / 1000
    // const deltaTime = 0.1
    lastTime = now

    for (const node of nodes.value) {
        let forceX = 0
        let forceY = 0

        for (const otherNode of nodes.value) {
            if (otherNode.id === node.id) continue

            const distance = Math.sqrt(Math.pow(otherNode.x - node.x, 2) + Math.pow(otherNode.y - node.y, 2))

            forceX += ((node.x - otherNode.x) / Math.pow(distance, repulsionPower)) * repulsion
            forceY += ((node.y - otherNode.y) / Math.pow(distance, repulsionPower)) * repulsion

            forceX +=
                -((node.x - otherNode.x) * Math.pow(distance, attractionPower)) *
                attraction *
                (node.backlinks.includes(otherNode.id) || node.pointsTo.includes(otherNode.id) ? linkedAttractionMultiplier : 1)
            forceY +=
                -((node.y - otherNode.y) * Math.pow(distance, attractionPower)) *
                attraction *
                (node.backlinks.includes(otherNode.id) || node.pointsTo.includes(otherNode.id) ? linkedAttractionMultiplier : 1)
        }

        node.x += forceX * deltaTime
        node.y += forceY * deltaTime
    }

    render()

    requestAnimationFrame(update)
    // setTimeout(update, 1000)
}

onMounted(() => {
    new ResizeObserver(() => {
        const width = container.value.offsetWidth
        const height = container.value.offsetHeight
        canvas.value.width = width
        canvas.value.height = height

        render()
    }).observe(container.value)

    update()
})

async function addNewNode(prompt: string, backlinks: string[], locationX: number, locationY: number) {
    let image = null

    if (backlinks.length === 0) {
        return
    }

    // Log the selectedModel from App.vue (assuming it's stored on window.selectedModel)
    console.log('Selected model in addNewNode:', window.selectedModel)

    // image = await generateImage(prompt)
    image = await modifyImage(nodeLookup[backlinks[0]].img, prompt)

    const id = Math.random().toString()
    const node = {
        x: locationX,
        y: locationY,
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

function openPrompt(node?: Node) {
    if (!node) {
        return
    }

    promptLocationX.value = node.x - 192 / 2 + 92.8 / 2
    promptLocationY.value = node.y + 100
    promptOpenNode.value = node
}
</script>

<template>
    <div class="bg-[var(--color-background)] overflow-hidden" ref="container">
        <div
            class="relative grid"
            :style="{
                background: `url(${gridImage})`,
                'image-rendering': 'crisp-edges',
                left: `${(viewOffsetX % 24) - 24}px`,
                top: `${(viewOffsetY % 24) - 24}px`,
            }"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
        ></div>

        <canvas class="absolute top-0 left-0 w-full h-full pointer-events-none" ref="canvas" />

        <div
            v-for="node in nodes"
            class="absolute w-24 h-24 border border-[var(--color-border)] rounded-xl"
            :style="{
                left: `${viewOffsetX + node.x}px`,
                top: `${viewOffsetY + node.y}px`,
            }"
            @click="openPrompt(node)"
        >
            <img class="w-full h-full object-cover select-none rounded-xl" :src="node.img" draggable="false" />
        </div>

        <Prompt
            class="absolute w-48 h-10"
            :style="{
                left: `${viewOffsetX + promptLocationX}px`,
                top: `${viewOffsetY + promptLocationY}px`,
            }"
            @prompt="prompt => addNewNode(prompt, [promptOpenNode.id], promptOpenNode.x + Math.random() * 100, promptOpenNode.y + Math.random() * 100)"
        />
    </div>
</template>

<style scoped>
.grid {
    width: calc(100% + 48px);
    height: calc(100% + 48px);
}
</style>
