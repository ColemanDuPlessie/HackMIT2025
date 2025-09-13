import { ref, type Ref } from 'vue'
import { modifyImage } from './OpenAI';

export type Node = { x: number; y: number; image: string; id: string; backlinks: string[]; pointsTo: string[] }

export const nodes: Ref<Node[]> = ref([
    {
        x: 100,
        y: 200,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/250px-Image_created_with_a_mobile_phone.png',
        id: '1',
        backlinks: [],
        pointsTo: ['2'],
    },
    {
        x: 500,
        y: 400,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s',
        id: '2',
        backlinks: ['1'],
        pointsTo: [],
    },
])

export const nodeLookup: Record<string, Node> = {
    '1': nodes.value[0],
    '2': nodes.value[1],
}

export async function addNewNode(prompt: string, backlinks: string[], locationX: number, locationY: number) {
    if (backlinks.length === 0) {
        return
    }

    // Log the selectedModel from App.vue (assuming it's stored on window.selectedModel)    // console.log('Selected model in addNewNode:', window.selectedModel)
    // image = await generateImage(prompt)

    const id = Math.random().toString()
    const node = {
        x: locationX,
        y: locationY,
        image: null,
        id,
        backlinks: backlinks,
        pointsTo: [],
    }

    nodes.value.push(node)
    nodeLookup[id] = node
    for (const backlink of backlinks) {
        nodeLookup[backlink].pointsTo.push(id)
    }

    node.image = await modifyImage(nodeLookup[backlinks[0]].image, prompt)
}

export const viewOffsetX = ref(0)
export const viewOffsetY = ref(0)