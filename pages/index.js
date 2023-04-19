import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { useRef } from "react";
import html2canvas from 'html2canvas';



export default function Home() {
  const aboutRef = useRef();
  const [Input, setInput] = useState("");
  const [recipeTitle, setTitle] = useState();
  const [result, setResult] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [showShareButton, setShowShareButton] = useState(false);

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
    setTitle(data.result.firstLine);
    setBackgroundImage(data.result.imageUrl);
    setInput("");
    setShowShareButton(true);
  }


  async function shareRecipe() {
    console.log("shareRecipe function called");
    const recipeElement = document.querySelector(`.${styles.resultWrapper}`);
  
    // Create a canvas with the same dimensions as the recipe element
    const canvas = document.createElement("canvas");
    canvas.width = recipeElement.clientWidth;
    canvas.height = recipeElement.clientHeight;
    const ctx = canvas.getContext("2d");
  
    // Draw the recipe image on the canvas
    const recipeImage = new Image();
    recipeImage.src = `/api/proxy?url=${encodeURIComponent(backgroundImage)}`;
    await new Promise((resolve) => {
      recipeImage.onload = () => {
        const imgAspectRatio = recipeImage.width / recipeImage.height;
        const canvasAspectRatio = canvas.width / canvas.height;
  
        let drawWidth, drawHeight, drawX, drawY;
        
        //crop the image so it doesnt get stretched/squashed
        if (imgAspectRatio > canvasAspectRatio) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspectRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }
  
        ctx.drawImage(recipeImage, drawX, drawY, drawWidth, drawHeight);
        resolve();
      };
    });
  
// Draw the semi-transparent white rectangle with rounded edges and a margin
  const margin = 0.1;
  const rectX = canvas.width * margin;
  const rectY = canvas.height * margin;
  const rectWidth = canvas.width * (1 - 2 * margin);
  const rectHeight = canvas.height * (1 - 2 * margin);
  const cornerRadius = 10;
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.moveTo(rectX + cornerRadius, rectY);
  ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
  ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
  ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
  ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
  ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
  ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
  ctx.lineTo(rectX, rectY + cornerRadius);
  ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
  ctx.closePath();
  ctx.fill();

    const recipeMargin = 0.15;
    // Draw the recipe text on the canvas
    const recipeCanvas = await html2canvas(recipeElement, {
      backgroundColor: null,
    });
    ctx.globalCompositeOperation = "source-over"; // Ensures that the recipe text overlays the image
    ctx.drawImage(
      recipeCanvas,
      canvas.width * recipeMargin,
      canvas.height * recipeMargin,
      canvas.width * (1 - 2 * recipeMargin),
      canvas.height * (1 - 2 * recipeMargin)
    );
  
    // Create a download link for the image
    const dataUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "recipe-image.png";
  
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
            <div className={styles.result}><span className={styles.recipeTitle}>{recipeTitle}</span>{result}</div>
            {backgroundImage && (
              <img className={styles.recipeImage} src={backgroundImage} alt="Generated recipe image" />
            )}
          </div>

          <button onClick={toggleAbout} className={styles.aboutButton}>About</button>

          {showShareButton && (
            <button className={styles.aboutButton} onClick={shareRecipe}>Share Recipe</button>
          )}
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

