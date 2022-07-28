import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";




export default function Home() {
  const [Input, setInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setResult(<img src = "https://raw.githubusercontent.com/AlexTimneyRhodes/GPTBakes/main/pages/loading.gif"/>);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe: Input }),
    });
    const data = await response.json();
    setResult(data.result);
    setInput("");
  }
  async function AboutFn() {
    var x = document.getElementById("AboutDiv");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  return (
    <div>
      <Head>
        <title>GPT Recipe Generator</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/icon.png" className={styles.icon} />
        <h3>Create a Recipe!</h3>
        
<div class="block"> 
What is this? This website allows you to use the GPT-3 Language model to create recipes. search your mind! any recipe is possible!
<h1>Make at your own risk</h1>
</div>


        <form onSubmit={onSubmit} >
          <input
            type="text"
            name="Recipe"
            placeholder="Enter a meal name (Leave blank for something random)"
            value={Input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="recipe" />
        </form>
        <div className={styles.result}>{result}</div>
        
      </main>
    </div>
  );
}
