import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch5 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge

  useEffect(() => {
    const sketch = (p) => {
      let colors;

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        // Definició de colors inspirats en Georges Braque
        colors = {
          base1: p.color(216, 195, 165), // Marró clar
          base2: p.color(163, 151, 133), // Gris fosc
          accent1: p.color(108, 74, 45), // Marró fosc
          accent2: p.color(102, 120, 122), // Blau grisós
          highlight: p.color(228, 222, 212), // Gris clar
          darkAccent: p.color(48, 36, 30, 150), // Fosc translúcid
        };

        drawArtwork();
      };

      p.windowResized = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.resizeCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);
        drawArtwork();
      };

      function drawArtwork() {
        drawBackgroundGradient();
        drawCubistShapes();
        drawStructuralLines();
      }

      function drawStructuralLines() {
        const cols = 6; // Nombre de columnes
        const rows = 6; // Nombre de files
        const cellWidth = p.width / cols;
        const cellHeight = p.height / rows;

        p.stroke(colors.darkAccent); // Línies fosques
        p.strokeWeight(2);
        for (let i = 0; i < 20; i++) {
          // Només unes quantes cel·les
          const col = Math.floor(p.random(cols));
          const row = Math.floor(p.random(rows));

          const x1 = col * cellWidth;
          const y1 = row * cellHeight;

          // Decideix aleatòriament quina vora dibuixar
          const drawTop = p.random() > 0.5;
          const drawRight = p.random() > 0.5;
          const drawBottom = p.random() > 0.5;
          const drawLeft = p.random() > 0.5;

          if (drawTop) p.line(x1, y1, x1 + cellWidth, y1); // Vora superior
          if (drawRight) p.line(x1 + cellWidth, y1, x1 + cellWidth, y1 + cellHeight); // Vora dreta
          if (drawBottom) p.line(x1, y1 + cellHeight, x1 + cellWidth, y1 + cellHeight); // Vora inferior
          if (drawLeft) p.line(x1, y1, x1, y1 + cellHeight); // Vora esquerra
        }
      }

      function drawBackgroundGradient() {
        let c1 = colors.base1; // Marró clar
        let c2 = colors.base2; // Gris fosc
        for (let y = 0; y < p.height; y++) {
          let inter = p.map(y, 0, p.height, 0, 1);
          let c = p.lerpColor(c1, c2, inter);
          p.stroke(c);
          p.line(0, y, p.width, y);
        }
      }

      function drawCubistShapes() {
        const cubistColors = [
          colors.accent1, // Marró fosc
          colors.accent2, // Blau grisós
          colors.base1, // Marró clar
          colors.highlight, // Gris clar
          colors.darkAccent, // Fosc translúcid
        ];

        const cols = 6; // Nombre de columnes
        const rows = 6; // Nombre de files
        const cellWidth = p.width / cols;
        const cellHeight = p.height / rows;

        // Dibuixar formes a la quadrícula
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const x = col * cellWidth;
            const y = row * cellHeight;

            // Decideix si la forma serà horitzontal o vertical
            const isHorizontal = p.random() > 0.5;

            // Mida de la forma
            const rectWidth = isHorizontal
              ? p.random(cellWidth * 0.8, cellWidth)
              : p.random(cellWidth * 0.4, cellWidth * 2);
            const rectHeight = isHorizontal
              ? p.random(cellHeight * 2, cellHeight * 0.5)
              : p.random(cellHeight * 0.5, cellHeight);

            // Seleccionar colors per al degradat
            const color1 = p.random(cubistColors);
            const color2 = p.random(cubistColors);

            // Aplicar el degradat dins d'una forma
            setGradient(
              x,
              y,
              rectWidth,
              rectHeight,
              color1,
              color2,
              isHorizontal ? "HORIZONTAL" : "VERTICAL"
            );
          }
        }
      }

      function setGradient(x, y, w, h, c1, c2, axis) {
        if (axis === "VERTICAL") {
          for (let i = y; i <= y + h; i++) {
            const inter = p.map(i, y, y + h, 0, 1);
            const c = p.lerpColor(c1, c2, inter);
            p.stroke(c);
            p.line(x, i, x + w, i);
          }
        } else if (axis === "HORIZONTAL") {
          for (let i = x; i <= x + w; i++) {
            const inter = p.map(i, x, x + w, 0, 1);
            const c = p.lerpColor(c1, c2, inter);
            p.stroke(c);
            p.line(i, y, i, y + h);
          }
        }
      }

      p.keyPressed = function () {
        // Redibuixa l'obra cada vegada que es prem una tecla
        drawArtwork();
      };

      p.captureImage = function () {
        const base64Image = p.canvas.toDataURL();
        return base64Image;
      };
    };

    let p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    const canvasElement = sketchRef.current.querySelector("canvas");
    const base64Image = canvasElement.toDataURL("image/png");
    setArtworkImage(base64Image); // Emmagatzema la imatge al context
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

export default GenerativeSketch5;
