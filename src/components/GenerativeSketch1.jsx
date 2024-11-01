import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import p5 from "p5";
import "../styles/GenerativeSketch.css";
import GenerativeArtCustomization from "./GenerativeArtCustomization";

const GenerativeSketch1 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    const sketch = (p) => {
      let angle = 0;
      let sizeFactor = 1;

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
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        p.translate(p.width / 2, p.height / 2);

        for (let i = 0; i < 200; i++) {
          p.push();
          p.rotate(angle);
          let r = p.map(p.sin(p.frameCount), -1, 1, 100, 200);
          let g = p.map(p.cos(p.frameCount / 2), -1, 1, 100, 255);
          let b = p.map(p.sin(p.frameCount / 4), -1, 1, 100, 255);
          p.stroke(r, g, b);
          p.line(0, 0, 100 * sizeFactor, 0);
          p.pop();
        }
        angle += 0.1;
      };

      p.mouseMoved = function () {
        sizeFactor = p.map(p.mouseX, 0, p.width, 0.5, 2);
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
    console.log("Imatge capturada en format base64:", base64Image); // Verifica la imatge capturada
    setArtworkImage(base64Image); // Emmagatzema la imatge al context
    console.log("Imatge emmagatzemada al context:", base64Image); // Verifica si s'ha emmagatzemat correctament
    navigate("/choose-your-artwork-size");
  };
  

  const toggleCustomization = () => {
    setShowCustomization(!showCustomization);
  };

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={toggleCustomization} className="customization-button">
        {showCustomization ? "Hide Controls" : "Show Controls"}
      </button>
      {showCustomization && <GenerativeArtCustomization sketchName="Noise Field" />}
      <button onClick={handleFinish} className="finish-button">
        Finish Personalization
      </button>
    </div>
  );
};

export default GenerativeSketch1;
