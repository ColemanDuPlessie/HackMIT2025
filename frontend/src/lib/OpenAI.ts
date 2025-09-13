export async function generateImage(prompt?: string) {
    const result = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: prompt ?? 'A cute baby sea otter',
            n: 1,
            size: "1024x1024"
        })
    })

    const json = await result.json()

    return json.data[0].url
}