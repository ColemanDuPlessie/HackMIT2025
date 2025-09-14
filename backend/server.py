import json
import time
from urllib import request
from urllib import parse
import uuid
import random
import base64
from io import BytesIO
from PIL import Image

file = open('./workflows/slow.json')
# file = open('./workflows/fast.json')
fast_workflow = json.loads(file.read())
file.close()

def queue_prompt(prompt, id):
    p = {"prompt": prompt, "prompt_id": id}
    data = json.dumps(p).encode('utf-8')

    req =  request.Request("http://localhost:25567/prompt", data=data)
    req.add_header('Content-Type', 'application/json')
    request.urlopen(req)

def get_history(id):
    req =  request.Request("http://localhost:25567/history/" + id)
    response = request.urlopen(req)
    
    return json.loads(response.read())

def get_queue():
    req =  request.Request("http://localhost:25567/queue")
    response = request.urlopen(req)
    
    return json.loads(response.read())

def get_image(filename, subfolder, folder_type):
    p = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    data = parse.urlencode(p)

    req =  request.Request("http://localhost:25567/view?" + data)
    response = request.urlopen(req)
    img_bytes = response.read()

    # Compress image using Pillow
    try:
        img = Image.open(BytesIO(img_bytes))
        buf = BytesIO()
        img = img.convert("RGB")
        img.save(buf, format="JPEG", quality=30)  # Lower quality for compression
        compressed_bytes = buf.getvalue()
        return compressed_bytes
    except Exception as e:
        # If not an image, return original bytes
        return img_bytes

while True:
    req = request.Request("https://hack-mit-2025-chi.vercel.app/api/status")
    response = request.urlopen(req)

    status = json.loads(response.read())

    print(status)
    
    for job in status:
        if job['type'] == 'fast':
            id = job['id']
            #job['prompt']

            print("qeueuing job " + id)

            queue_prompt(fast_workflow, id)

            print("queued job " + id)

            finished = False

            while not finished:
                history = get_history(id)

                if not id in history:
                    continue

                job_history = history[id]
                outputs = job_history['outputs']

                for node_id in outputs:
                    output = outputs[node_id]
                    images = output['images']

                    for image in images:
                        filename = image['filename']
                        subfolder = image['subfolder']
                        folder_type = image['type']

                        image_b64 = base64.b64encode(get_image(filename, subfolder, folder_type)).decode('utf-8')
                        payload = json.dumps({"image": image_b64, "id": id}).encode('utf-8')

                        req = request.Request("https://hack-mit-2025-chi.vercel.app/api/submit", data=payload)
                        req.add_header('Content-Type', 'application/json')
                        response = request.urlopen(req)

                        print(response.read())

                finished = True

                time.sleep(0.1)

            print("finished job " + id)

    time.sleep(5)

fast_workflow["3"]["inputs"]["seed"] = random.randint(0, 999999)
id = str(uuid.uuid4())
queue_prompt(fast_workflow, id)

while True:
    history = get_history(id)

    print("skipping! " + id)
    print(history.keys())

    if not id in history:
        continue

    job_history = history[id]
    outputs = job_history['outputs']

    # print(get_queue())
    print(get_history())

    for node_id in outputs:
        output = outputs[node_id]
        images = output['images']

        for image in images:
            filename = image['filename']
            subfolder = image['subfolder']
            folder_type = image['type']

            file = open('./test.png', 'wb')
            file.write(get_image(filename, subfolder, folder_type))
            file.close()

    print("\n\n")
