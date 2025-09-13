export async function generateImage(prompt?: string) {
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const result = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt ?? 'A cute baby sea otter',
            n: 1,
            size: "1024x1024"
        })
    })

    const json = await result.json()

    console.log(json)

    return json.data[0].url
}