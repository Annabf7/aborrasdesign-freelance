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
      let lines = [];

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        for (let i = 0; i < 50; i++) {
          lines.push({
            x1: p.random(p.width),
            y1: p.random(p.height),
            x2: p.random(p.width),
            y2: p.random(p.height),
            speedX: p.random(-2, 2),
            speedY: p.random(-2, 2),
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

        lines.forEach((line) => {
          p.stroke(line.color);
          p.strokeWeight(2);
          p.line(line.x1, line.y1, line.x2, line.y2);

          line.x1 += line.speedX;
          line.y1 += line.speedY;
          line.x2 += line.speedX;
          line.y2 += line.speedY;

          if (line.x1 > p.width || line.x1 < 0 || line.x2 > p.width || line.x2 < 0)
            line.speedX *= -1;
          if (line.y1 > p.height || line.y1 < 0 || line.y2 > p.height || line.y2 < 0)
            line.speedY *= -1;
        });
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

export default GenerativeSketch6;
