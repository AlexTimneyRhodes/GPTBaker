import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [Input, setInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
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

  return (
    <div>
      <Head>
        <title>GPT Recipe Generator</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/icon.png" className={styles.icon} />
        <h3>What am I eating tonight?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="recipe"
            placeholder="Enter a meal name (Leave blank for something random)"
            value={Input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="recipe" />
        </form>
        <pre><div className={styles.result}>{result}</div></pre>
        
      </main>
    </div>
  );
}
