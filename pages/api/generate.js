
import { Configuration, OpenAIApi } from "openai";
import generateImage from "./generate_image";
import fs from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: generateRecipe(req.body.recipe),
    temperature: 0.7,
    stream: false,
    max_tokens: 512,
  });

  let output;
  if (req.body.recipe == "") {
    output = completion.data.choices[0].text;
  } else {
    output = req.body.recipe + completion.data.choices[0].text;
  }

  // Get the first line of the text output
  const firstLine = output.split('\n').find(line => line.trim() !== '');

  // Log the firstLine to log.txt
  fs.appendFile("log.txt", firstLine + "\n", (err) => {
    if (err) {
      console.error("Error writing to log.txt:", err);
    }
  });
  // Generate the image using DALL-E API
  const imageUrl = await generateImage(firstLine);

  // Combine the image URL with the text output
  const result = { text: output, imageUrl: imageUrl };

  res.status(200).json({ result: result });
}

function generateRecipe(Recipe) {
  return `Write a recipe for: ${Recipe}`;
}
