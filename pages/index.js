import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { useRef } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";



export default function Home() {
  const aboutRef = useRef();
  const [Input, setInput] = useState("");
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
    setBackgroundImage(data.result.imageUrl);
    setInput("");
    setShowShareButton(true);
  }


  //share function. should work on both mobile and desktop. on mobile this should create an image of the recipe and use the share prompt to share it through various apps. on desktop(or browsers that do not support sharing) it should instead print the page to pdf, with images.
  async function shareRecipe() {
    console.log('shareRecipe function called');
    const recipeElement = document.querySelector(`.${styles.resultWrapper}`);
    const recipeImageElement = document.querySelector(`.${styles.recipeImage}`);
    
    // Create a canvas with the same dimensions as the recipe element
    const canvas = document.createElement("canvas");
    canvas.width = recipeElement.clientWidth;
    canvas.height = recipeElement.clientHeight + recipeImageElement.clientHeight;
    const ctx = canvas.getContext("2d");
  
    // Draw the recipe text and image on the canvas
    const recipeCanvas = await html2canvas(recipeElement, { backgroundColor: null });
    const recipeImageCanvas = await html2canvas(recipeImageElement, { backgroundColor: null });
    ctx.drawImage(recipeCanvas, 0, 0);
    ctx.drawImage(recipeImageCanvas, 0, recipeElement.clientHeight);
  
    if (navigator.share) {
      console.log('navigator.share supported');
      canvas.toBlob(async (blob) => {
        const imageFile = new File([blob], "recipe-image.png", { type: "image/png" });
  
        try {
          await navigator.share({
            title: 'GPT Recipe Generator',
            text: `Check out this recipe I generated with GPT Recipe Generator:`,
            files: [imageFile],
            url: window.location.href,
          });
          console.log('Recipe shared successfully');
        } catch (error) {
          console.error('Error sharing recipe:', error);
        }
      });
    } else {
      try {
        const dataUrl = canvas.toDataURL();
  
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
  
        pdf.save("recipe.pdf");
      } catch (error) {
        console.error("Failed to generate PDF", error);
      }
    }
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

