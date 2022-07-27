import { Configuration, OpenAIApi } from "openai";
import { Stream } from "stream";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var output;
const fs = require('fs');

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: generateRecipe(req.body.recipe),
    temperature: 0.6,
    stream: false,
    max_tokens: 1000
  });
  if (req.body.recipe == ""){
    
  output = completion.data.choices[0].text;
  }
  else{
  output = req.body.recipe +completion.data.choices[0].text;
}
  res.status(200).json({ result: output });
  //console.log(result);
  
}

function generateRecipe(Recipe) {
  return `Write a recipe for: ${Recipe}`;
}
