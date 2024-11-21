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
      let josefinFont; // Variable per la font

      // Precarrega la font
      p.preload = function () {
        josefinFont = p.loadFont("fonts/JosefinSans-Regular.ttf"); // Ruta dins de la carpeta public
      };

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noLoop(); // No cal redibuixar constantment, ja que és una obra estàtica
      };

      p.draw = function () {
        // Fons
        p.background("#f4eede");

        // Dibuixar les línies negres
        const lineWidth = p.width * 0.0023; // Amplada de les línies
        const lineHeight = p.height * 0.3; // Alçada de les línies
        const lineSpacing = p.width * 0.015; // Espai entre línies
        const linesStartX = p.width * 0.35; // Posició inicial de les línies
        const linesEndX = p.width * 0.65;

        p.stroke("#151411");
        p.strokeWeight(lineWidth);
        p.noFill();

        for (let x = linesStartX; x <= linesEndX; x += lineSpacing) {
          p.line(x, p.height / 2 - lineHeight * 0.2, x, p.height / 2 + lineHeight);
        }

        // Dibuixar el cercle groc
        const circleDiameter = p.height * 0.4; // Diàmetre del cercle
        const circleX = p.width / 2;
        const circleY = p.height / 2;

        p.noStroke();
        p.fill("#f3af48");
        p.ellipse(circleX, circleY, circleDiameter, circleDiameter);

        // Afegir textura d'esquitxades
        p.fill(255, 255, 255, 80);
        for (let i = 0; i < 200; i++) {
          const offsetX = p.random(-circleDiameter / 2, circleDiameter / 2);
          const offsetY = p.random(-circleDiameter / 2, circleDiameter / 2);
          const distFromCenter = p.dist(0, 0, offsetX, offsetY);
          if (distFromCenter < circleDiameter / 2) {
            p.circle(circleX + offsetX, circleY + offsetY, p.random(1, 4));
          }
        }

        // Afegir la tipografia Bauhaus
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont(josefinFont); // Carrega la font Josefin Sans
        p.textStyle(p.NORMAL); // Assegura que no s'aplica negreta
        p.fill("#151411");

        // Escriure "bauhaus" a l'esquerra
        p.textSize(p.height * 0.03); // Ajusta la mida del text
        p.text("bauhaus", linesStartX - p.width * -0.025, p.height / 2 + lineHeight * 1.1);

        // Escriure "1919" a la dreta
        p.text("1919", linesEndX + p.width * -0.01, p.height / 2 + lineHeight * 1.1);

        // Escriure "AUSSTELLUNG" a la part superior
        const textX = linesStartX; // Alineat amb la primera línia
        const textY = p.height * 0.1; // A la part superior del llenç
        p.push();
        p.translate(textX, textY);
        p.rotate(-p.HALF_PI); // Rotem el text verticalment
        p.text("AUSSTELLUNG", -170, 0); // Text vertical
        p.pop();
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.redraw(); // Recalcula el disseny en redimensionar la finestra
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
