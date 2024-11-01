import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch3 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge

  useEffect(() => {
    const sketch = (p) => {
      let t = 0;

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);
        p.angleMode(p.DEGREES);
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
        p.strokeWeight(2);
        p.noFill();

        for (let i = 0; i < 10; i++) {
          let r = p.map(p.sin(t + i), -1, 1, 100, 255);
          let g = p.map(p.sin(t + i * 2), -1, 1, 100, 255);
          let b = p.map(p.sin(t + i * 3), -1, 1, 100, 255);
          p.stroke(r, g, b);
          p.ellipse(p.random(p.width), p.random(p.height), p.random(50, 200), p.random(50, 200));
        }

        t += 0.01;
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

export default GenerativeSketch3;
