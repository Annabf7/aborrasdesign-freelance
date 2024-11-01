import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { ArtworkContext } from "./ArtworkContext"; // Importa el context per a la imatge global
import p5 from "p5"; // Importem la llibreria p5.js
import "../styles/GenerativeSketch.css"; // Assegura't que aquest CSS estigui inclòs

const GenerativeSketch7 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate(); // Definim useNavigate per a la redirecció
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge

  useEffect(() => {
    const sketch = (p) => {
      let triangles = [];

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        // Genera triangles inicials
        for (let i = 0; i < 30; i++) {
          triangles.push({
            x1: p.random(p.width),
            y1: p.random(p.height),
            x2: p.random(p.width),
            y2: p.random(p.height),
            x3: p.random(p.width),
            y3: p.random(p.height),
            speedX: p.random(-1, 1),
            speedY: p.random(-1, 1),
            color: [p.random(255), p.random(255), p.random(255)],
          });
        }
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

        // Dibuixa i mou els triangles
        triangles.forEach((triangle) => {
          p.fill(triangle.color);
          p.noStroke();
          p.triangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);

          // Mou el triangle
          triangle.x1 += triangle.speedX;
          triangle.y1 += triangle.speedY;
          triangle.x2 += triangle.speedX;
          triangle.y2 += triangle.speedY;
          triangle.x3 += triangle.speedX;
          triangle.y3 += triangle.speedY;

          // Rebot a les vores
          if (
            triangle.x1 > p.width ||
            triangle.x1 < 0 ||
            triangle.x2 > p.width ||
            triangle.x2 < 0 ||
            triangle.x3 > p.width ||
            triangle.x3 < 0
          )
            triangle.speedX *= -1;
          if (
            triangle.y1 > p.height ||
            triangle.y1 < 0 ||
            triangle.y2 > p.height ||
            triangle.y2 < 0 ||
            triangle.y3 > p.height ||
            triangle.y3 < 0
          )
            triangle.speedY *= -1;
        });
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

export default GenerativeSketch7;
