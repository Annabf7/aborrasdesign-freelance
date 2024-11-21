import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch6 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context

  useEffect(() => {
    const sketch = (p) => {
      // Definir colors com a variable global dins del sketch
      let colors = {};

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        // Inicialització de colors
        colors = {
          background: p.color("#15161c"), // Fons negre
          white: p.color("#e2d9c8"), // Blanc del cercle gran
          offWhite: p.color("#dcd1bf"), // Blanc trencat del rectangle
          red: p.color("#c62b0f"), // Vermell del rectangle vertical
          dark: p.color("#1f1f27"), // Negre del cercle dividit
          lineWhite: p.color("#dfd9cf"), // Blanc de les línies inferiors
          lineBlack: p.color("#15161c"), // Negre de les línies diagonals
        };

        drawArtwork(); // Dibuixar l'obra
      };

      p.windowResized = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.resizeCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        if (Object.keys(colors).length > 0) {
          drawArtwork(); // Redibuixar l'obra només si `colors` està inicialitzat
        }
      };

      function drawArtwork() {
        if (Object.keys(colors).length === 0) {
          console.error("Colors not initialized"); // Evitar cridar sense colors inicialitzats
          return;
        }

        // Fons
        p.background(colors.background);

        // Rectangle blanc superior esquerre
        const rectX = p.width * 0.147;
        const rectY = p.height * 0.01;
        const rectWidth = p.width * 0.4;
        const rectHeight = p.height * 0.7;

        p.push();
        p.translate(rectX + rectWidth / 2, rectY + rectHeight / 2);
        p.rotate(p.radians(-60));
        p.fill(colors.offWhite);
        p.noStroke();
        p.rectMode(p.CENTER);
        p.rect(0, 0, rectWidth, rectHeight);
        p.pop();

        // Rectangle vermell vertical
        p.fill(colors.red);
        p.stroke(colors.lineBlack);
        p.strokeWeight(5);
        p.rect(p.width * 0.32, p.height * 0.23, p.width * 0.17, p.height * 0.74);

        // Cercle central dividit
        const circleX = p.width * 0.5;
        const circleY = p.height * 0.5;
        const circleRadius = p.width * 0.2;

        p.push();
        p.translate(circleX, circleY);
        p.rotate(p.radians(30));
        p.fill(colors.dark);
        p.arc(0, 0, circleRadius, circleRadius, p.HALF_PI, -p.HALF_PI, p.PIE);
        p.fill(colors.white);
        p.arc(0, 0, circleRadius, circleRadius, -p.HALF_PI, p.HALF_PI, p.PIE);
        p.pop();

        // Cercle negre damunt del rectangle blanc
        p.fill(colors.dark);
        const smallCircleX = p.width * 0.25;
        const smallCircleY = p.height * 0.2;
        const smallCircleRadius = p.width * 0.06;
        p.circle(smallCircleX, smallCircleY, smallCircleRadius);

        // Línies horitzontals i verticals a la part inferior dreta
        p.stroke(colors.lineWhite);
        p.strokeWeight(4);

        // Ajust de posició horitzontal i vertical per a les horitzontals
        const offsetXHor = p.width * 0.56; // Posició inicial horitzontal per a línies horitzontals
        const offsetY = p.height * 0.85; // Mateixa alçada

        // Horitzontals
        for (let i = 0; i < 5; i++) {
          const y = offsetY + i * 10; // Mateixa alçada amb desplaçament
          p.line(offsetXHor, y, offsetXHor + p.width * 0.2, y); // Mateixa longitud però a la dreta
        }

        // Ajust de posició horitzontal per a les verticals
        const offsetXVert = p.width * 0.58; // Posició inicial més a la dreta per a línies verticals

        // Vertical
        for (let i = 0; i < 5; i++) {
          const x = offsetXVert + i * 10; // Mateixa posició inicial amb desplaçament
          p.line(x, offsetY, x, offsetY + p.height * 0.1); // Mateixa alçada vertical però més a la dreta
        }
        // Línies diagonals creuades al llenç
        function drawCrossingLines() {
          const diagonalLines = [
            {
              x1: p.width * 0.1,
              y1: p.height * 0.2,
              x2: p.width * 0.9,
              y2: p.height * 0.8,
              color: colors.lineWhite,
            },
           
          ];
//per si volem incloure en un futur mes lineas
          diagonalLines.forEach((line) => {
            p.stroke(line.color);
            p.strokeWeight(2);
            p.line(line.x1, line.y1, line.x2, line.y2);
          });
        }
        drawCrossingLines();
      }

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

export default GenerativeSketch6;
