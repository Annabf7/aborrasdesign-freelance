import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importa el context per a la imatge global
import p5 from "p5"; 
import "../styles/GenerativeSketch.css"; 
const GenerativeSketch_8 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate(); // Definim useNavigate per a la redirecció
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge

  useEffect(() => {
    const sketch = (p) => {
      let angle = 0;

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);
      };

      p.windowResized = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.resizeCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);
      };

      p.draw = function () {
        p.background(0);
        p.translate(p.width / 2, p.height / 2); // Centrem l'sketch al mig

        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();

        for (let i = 0; i < 50; i++) {
          let r = p.map(p.sin(p.frameCount), -1, 1, 100, 255);
          let g = p.map(p.cos(p.frameCount / 2), -1, 1, 100, 255);
          let b = p.map(p.sin(p.frameCount / 4), -1, 1, 100, 255);
          p.stroke(r, g, b);
          p.push();
          p.rotate(angle + i * 10);
          p.rect(0, 0, 50, 50); // Dibuixa quadrats que giren en espiral
          p.pop();
        }
        angle += 0.02;
      };

      // Funció per capturar la imatge del canvas
      p.captureImage = function () {
        const base64Image = p.canvas.toDataURL(); // Captura el canvas com a imatge base64
        return base64Image; // Retorna la imatge
      };
    };

    let p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    // Captura la imatge del canvas i redirigeix a la pàgina de selecció de mida
    const canvasElement = sketchRef.current.querySelector("canvas");
    const base64Image = canvasElement.toDataURL("image/png"); // Captura la imatge com a base64

    setArtworkImage(base64Image); // Emmagatzema la imatge al context global
    // Redirigim a la pàgina de "ChooseYourArtworkSize"
    navigate("/choose-your-artwork-size");
  };

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={handleFinish} className="finish-button">
        Finish Personalization
      </button>
    </div>
  );
};

export default GenerativeSketch_8;
