import { KEY } from "./API_KEYS.js";
const HFInference = (
await import("https://cdn.skypack.dev/@huggingface/inference@2.0.0")
).HfInference;

export const MODELS = {"dummy" : "Random Dummy Image", "dall-e-3" : "dall-E 3", "dall-e-2" : "dall-E 2", "stable-diffusion-xl-1.0" : "Stable Diffusion XL 1.0"}

export async function generateImage(model="dummy", prompt) {
    /**
     * Returns a URL to a generated image based on the specified model and prompt.
    */
   if (model == "dummy") {
    return 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-sujH5PAvgIDflFaJtD9m4dw8/user-Wyj8RoInvG8bWE4IcQmzzcd6/img-vxKxQOr9XSCQUqWv1lkrt94g.png?st=2025-09-13T16%3A53%3A32Z&se=2025-09-13T18%3A53%3A32Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=475fd488-6c59-44a5-9aa9-31c4db451bea&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-12T18%3A36%3A06Z&ske=2025-09-13T18%3A36%3A06Z&sks=b&skv=2024-08-04&sig=Ko8ZmVI90DDXm6shZ6sPFJhCLmg/87vaJrGfMhl6qlY%3D'
   } else if (model == "dall-e-3" || model == "dall-e-2") {
        const result = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt ?? 'A cute baby sea otter',
                n: 1,
                size: "1024x1024"
            })
        })
   } else if (model == "stable-diffusion-xl-1.0") {
        const hf = new HFInference(KEY);
        const blob = await hf.textToImage({
        inputs:
            prompt + " <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>",
        parameters: {
            negative_prompt: "easynegative",
        },
        model: "stabilityai/stabilityai/stable-diffusion-3.5-medium-tensorrt",
        });
    }
}