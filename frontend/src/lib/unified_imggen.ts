import { KEY } from "./API_KEYS.js";
import { InferenceClient } from '@huggingface/inference';


export async function generateImage(model="dummy", prompt: string) {
    /**
     * Returns a URL to a generated image based on the specified model and prompt.
    */
   console.log("Generating image with model:", model, "and prompt:", prompt);
   if (model == "dummy") {
    return 'https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX'
   } else if (model == "dall-e-3" || model == "dall-e-2") {
        console.log("Using OpenAI API for image generation");
        const response = await fetch('https://api.openai.com/v1/images/generations', {
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
        });
        const result = await response.json();
        return result.data[0].url;
   } else if (model == "stable-diffusion-xl-1.0" || model == "stable-diffusion-2") {
        const hf = new InferenceClient(KEY);
        console.log("Using HuggingFace API for image generation");
        const blob:string = await hf.textToImage({
        inputs:
            prompt ?? 'A happy puppy in a jungle' + " <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>",
        parameters: {
            negative_prompt: "easynegative",
        },
        model: "stabilityai/"+model,});
        return blob; // URL.createObjectURL(blob);
    }
}