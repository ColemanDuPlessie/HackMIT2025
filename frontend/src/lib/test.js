import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";
dotenv.config();

import { KEY } from "./API_KEYS.js";
const openai = new OpenAI({ apiKey: KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your prompt for the images: ", async (userPrompt) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "add the two people to one picture" },
            //MODIFIY WITH USERPROMPT

            { type: "input_image", image_url: "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"},
            { type: "input_image", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN6NnehmgDZgf8LuQrGs8J0eodVV69FFk3v78CTgIyNf0DkfYp_5bv-vtLpAx1LIn3ZhM&usqp=CAU"},
          ],
        },
      ],
      tools: [{ type: "image_generation", input_fidelity: "low" }],
    });

    const imageBase64 = response.output.find(o => o.type === "image_generation_call")?.result;

    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      fs.writeFileSync("output.png", imageBuffer);
      console.log("Image saved as output.png");
    } else {
      console.log("No image returned");
      console.dir(response, { depth: null });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    rl.close();
  }
});