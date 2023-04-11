
import fetch from "node-fetch";

export default async function generateImage(prompt) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
  
      prompt: "photo, food, a serving of " + prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  const imageGeneration = await response.json();
  const imageData = imageGeneration.data[0].url;
  return imageData;
}
