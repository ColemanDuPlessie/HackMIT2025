export async function generateImage(prompt?: string) {
    return 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-sujH5PAvgIDflFaJtD9m4dw8/user-Wyj8RoInvG8bWE4IcQmzzcd6/img-vxKxQOr9XSCQUqWv1lkrt94g.png?st=2025-09-13T16%3A53%3A32Z&se=2025-09-13T18%3A53%3A32Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=475fd488-6c59-44a5-9aa9-31c4db451bea&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-12T18%3A36%3A06Z&ske=2025-09-13T18%3A36%3A06Z&sks=b&skv=2024-08-04&sig=Ko8ZmVI90DDXm6shZ6sPFJhCLmg/87vaJrGfMhl6qlY%3D'

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