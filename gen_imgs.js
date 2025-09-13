import { KEY } from "./API_KEYS.js";
async function genImg() {
    const HFInference = (
        await import("https://cdn.skypack.dev/@huggingface/inference@2.0.0")
    ).HfInference;
    const hf = new HFInference(KEY);
    const blob = await hf.textToImage({
    inputs:
        "a puppy wearing a birthday hat sitting in a jungle. The jungle is dark but comfortable, the puppy is smiling. Digital art style. <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>",
    parameters: {
        negative_prompt: "easynegative",
    },
    model: "prompthero/openjourney-v4",
    });
    const tab = window.open((target = "_blank"));
    tab.location.href = window.URL.createObjectURL(blob);
}