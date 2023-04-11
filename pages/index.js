import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { useRef } from "react";

export default function Home() {
  const aboutRef = useRef();
  const [Input, setInput] = useState("");
  const [result, setResult] = useState();
  const [backgroundImage, setBackgroundImage] = useState();

  const toggleAbout = () => {
    aboutRef.current.classList.toggle(styles.hidden);
  };

  const closeAbout = (e) => {
    if (e.target === aboutRef.current) {
      aboutRef.current.classList.add(styles.hidden);
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    setResult(<img src="https://raw.githubusercontent.com/AlexTimneyRhodes/GPTBaker/main/pages/loading.gif" />);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe: Input }),
    });
    const data = await response.json();
    setResult(data.result.text);
    setBackgroundImage(data.result.imageUrl);
    setInput("");
  }

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <Head>
        <title>GPT Recipe Generator</title>
        <link rel="icon" href="/icon.png" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5347384724265672"
          crossorigin="anonymous"></script>
      </Head>
      <main className={styles.main}>
        <div className={styles.content}>
          <img src="/icon.png" className={styles.icon} />
          <h3>Create a Recipe!</h3>

          <div className={styles.header}>
            What is this? This website allows you to use the GPT-3 Language model to create recipes. search your mind! any recipe is possible!
            <h1>Make at your own risk</h1>
          </div>

          <form onSubmit={onSubmit} className={styles.form}>

            <input
              type="text"
              name="Recipe"
              placeholder="Enter a meal name (Leave blank for something random)"
              value={Input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={styles.submitButton}>Generate Recipe</button>
          </form>
          <div className={styles.resultWrapper}>
            <div className={styles.result}>{result}</div>
            {backgroundImage && (
              <img className={styles.recipeImage} src={backgroundImage} alt="Generated recipe image" />
            )}
          </div>
          <button onClick={toggleAbout} className={styles.aboutButton}>About</button>
          <div ref={aboutRef} onClick={closeAbout} className={`${styles.aboutOverlay} ${styles.hidden}`}>
  <div className={styles.about}>
    <h2>About This Website</h2>
    <p>Welcome to my website! My name is Alex Rhodes and I am currently studying software engineering at Waikato University. I created this website as a fun project to explore the capabilities of modern language models and artificial intelligence.</p>

    <p>The main purpose of this website is to use the GPT-3 LLM to generate recipes from a prompt. Additionally, I use the DALLE API system to create an image for the recipe. It's important to note that due to the nature of the language model, some baked recipes may have odd ratios. However, many of these recipes do actually work and can be a fun experiment in the kitchen!</p>

    <p>I hope you enjoy using my website to discover new and exciting recipes. Please feel free to contact me with any feedback or suggestions. Thank you for visiting!</p>
    <p>Alex Rhodes</p>
    <p>AlexTimneyRhodes@gmail.com</p>
  </div>
</div>
        </div>
        
      </main>
      
    </div>
  );
}
