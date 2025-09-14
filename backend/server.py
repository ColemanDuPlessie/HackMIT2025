from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")

device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = pipe.to(device)

prompt = "a cat sitting on a windowsill, oil painting style"

image = pipe(prompt).images[0]

image.save("generated_image.png")
print("Image saved as 'generated_image.png'!")