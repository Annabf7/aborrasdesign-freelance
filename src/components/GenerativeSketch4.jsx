import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext";
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch4 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext);

  useEffect(() => {
    const sketch = (p) => {
      let font;

      p.preload = function () {
        font = p.loadFont(
          "/fonts/comicbd.ttf",
          () => console.log("Font carregada correctament"),
          () => console.error("Error carregant la font")
        );
      };

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noLoop();

        p.background(colors.red); // Fons vermell
        drawCloud(); // Dibuixar els punts per tot el llenç
        drawBackgroundLines(); // Línies blaves amb contorn negre
        drawRays(); // Rajos grocs i blancs
        drawText(); // Text "POP!"
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.redraw();
      };

      const colors = {
        red: p.color(235, 28, 36), // #eb1c24
        blue: p.color(15, 118, 185), // #0f76b9
        yellow: p.color(253, 236, 0), // #fdec00
        white: p.color(255, 255, 255), // #ffffff
        darkStroke: p.color(20, 0, 0), // #140000
        dotBlue: p.color(24, 59, 177), // #183bb1
        dotBackground: p.color(237, 248, 255), // #edf8ff
        textDepth: p.color(1, 0, 4), // #010004
        orange: p.color(252, 176, 64), //#fcb040
      };

      function drawBackgroundLines() {
        // Línies blaves amb contorn negre
        const lineCount = 20; // Nombre de línies
        const strokeWidth = 25; // Amplada de les línies blaves
        const outerRadius = p.width; // Longitud de les línies

        for (let i = 0; i < lineCount; i++) {
          const angle = (p.PI / (lineCount / 2)) * i;

          const x = p.width / 2 + p.cos(angle) * outerRadius;
          const y = p.height / 2 + p.sin(angle) * outerRadius;

          // Línia de contorn negre
          p.stroke(colors.darkStroke); // Color del contorn
          p.strokeWeight(strokeWidth + 10); // Més gruixut per fer el contorn
          p.line(p.width / 2, p.height / 2, x, y);

          // Línia blava a sobre
          p.stroke(colors.blue); // Color blau
          p.strokeWeight(strokeWidth);
          p.line(p.width / 2, p.height / 2, x, y);
        }
      }

      function drawCloud() {
        // Fons del llenç amb punts blaus sobre fons blanc
        p.fill(colors.red); // Fons vermell
        p.noStroke();
        p.rect(0, 0, p.width, p.height); // Dibuixar el fons vermell

        // Dibuixar punts a tot el llenç amb opacitat
        p.fill(p.color(24, 59, 177, 150)); // Blau dels punts amb opacitat (150 sobre 255)
        const dotSpacing = 15; // Espaiat entre punts
        for (let x = 0; x < p.width; x += dotSpacing) {
          for (let y = 0; y < p.height; y += dotSpacing) {
            p.ellipse(x, y, 5, 5); // Dibuixar cada punt
          }
        }
      }

      function drawRays() {
        // Rajos grocs i blancs sortint del centre
        const rayLength = p.width; // Ara ocupen tot el llenç
        for (let i = 0; i < 12; i++) {
          const color = i % 2 === 0 ? colors.yellow : colors.white;
          const angle1 = (p.TWO_PI / 12) * i;
          const angle2 = angle1 + p.PI / 12;

          p.fill(color);
          p.stroke(colors.darkStroke); // Color del contorn
          p.strokeWeight(2); // Gruix del contorn
          p.beginShape();
          // Base exactament al centre
          p.vertex(p.width / 2, p.height / 2);
          // Extrems del raig cap a fora del llenç
          p.vertex(
            p.width / 2 + p.cos(angle1) * rayLength,
            p.height / 2 + p.sin(angle1) * rayLength
          );
          p.vertex(
            p.width / 2 + p.cos(angle2) * rayLength,
            p.height / 2 + p.sin(angle2) * rayLength
          );
          p.endShape(p.CLOSE);
        }

        // Esclat estil rellamp al centre
        const flashColor = colors.white; // Color del rellamp
        const flashThickness = 4; // Gruix de les línies del rellamp
        p.stroke(flashColor);
        p.strokeWeight(flashThickness);
        p.noFill();

        // Dibuixa un rellamp amb línies
        const flashLines = [
          [-10, -10, 0, -20], // Primer segment del rellamp
          [0, -20, 10, -10], // Segon segment
          [10, -10, 0, 0], // Tercer segment
        ];

        for (let line of flashLines) {
          p.line(
            p.width / 2 + line[0],
            p.height / 2 + line[1],
            p.width / 2 + line[2],
            p.height / 2 + line[3]
          );
        }
      }

      function drawText() {
        // Configuració del text
        p.textFont(font);
        p.textSize(350); // Augmenta la mida del text
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();

        // Profunditat negra
        const depthOffset = 10;
        p.fill(colors.textDepth);

        // Ajust de posició per a cada lletra
        const letters = [
          { char: "P", xOffset: -230, yOffset: 40 }, // Primer P, lleugerament més avall
          { char: "O", xOffset: 0, yOffset: -30 }, // O al centre
          { char: "P", xOffset: 230, yOffset: -60 }, // Segon P, lleugerament més amunt
          { char: "!", xOffset: 360, yOffset: -80 }, // Segon P, lleugerament més amunt
        ];

        // Dibuixar cada lletra amb profunditat
        letters.forEach((letter) => {
          p.text(
            letter.char,
            p.width / 2 + letter.xOffset + depthOffset,
            p.height / 2 + letter.yOffset + depthOffset
          );
        });

        // Text taronja principal
        p.fill(colors.orange);
        letters.forEach((letter) => {
          p.text(letter.char, p.width / 2 + letter.xOffset, p.height / 2 + letter.yOffset);
        });
      }
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    const canvasElement = sketchRef.current.querySelector("canvas");
    const base64Image = canvasElement.toDataURL("image/png");
    setArtworkImage(base64Image);
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

export default GenerativeSketch4;
