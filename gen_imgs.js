import { KEY } from "./API_KEYS.js";
export async function genImg() {
    console.log("Generating image...");
    const HFInference = (
        await import("https://cdn.skypack.dev/@huggingface/inference@2.0.0")
    ).HfInference;
    const hf = new HFInference(KEY);
    console.log("Sending Huggingface query...");
    const blob = await hf.textToImage({
    inputs:
        "a puppy wearing a birthday hat sitting in a jungle. The jungle is dark but comfortable, the puppy is smiling. Digital art style. <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>",
    parameters: {
        negative_prompt: "easynegative",
    },
    model: "stabilityai/stabilityai/stable-diffusion-3.5-medium-tensorrt",
    });
    console.log("Image generated!");
    console.log(String(blob));
    const imageUrl = URL.createObjectURL(blob);
    window.open(imageUrl, "_blank");
    document.querySelector("#outputImg").src = imageUrl;
    console.log("Image opened in new tab!");
}